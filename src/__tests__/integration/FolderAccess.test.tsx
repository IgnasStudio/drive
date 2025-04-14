import React from 'react';
import { render, screen } from '@testing-library/react';
import IgnasStudioDrive from '~/app/f/[folderId]/page';
import { QUERIES } from '~/server/db/queries';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Set up mocks
jest.mock('~/server/db/queries', () => ({
  QUERIES: {
    getFolderById: jest.fn(),
    getFolders: jest.fn(),
    getFiles: jest.fn(),
    getAllParentsForFolder: jest.fn(),
  },
}));

// Use proper typing for mocks
const mockAuth = auth as unknown as jest.Mock;
const mockRedirect = redirect as unknown as jest.Mock;

jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));

// Mock drive contents component
jest.mock('~/components/drive/drive-contents', () => ({
  __esModule: true,
  default: () => <div data-testid="drive-contents">Drive Contents</div>,
}));

describe('Folder Access Tests', () => {
  const userId = 'user-123';
  const otherUserId = 'different-user-456';
  
  beforeEach(() => jest.clearAllMocks());

  it('redirects to sign-in for unauthenticated users', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    
    await IgnasStudioDrive({ 
      params: Promise.resolve({ folderId: '1' }) 
    });
    
    expect(mockRedirect).toHaveBeenCalledWith('/sign-in');
  });

  it('shows access denied for non-existent folders', async () => {
    mockAuth.mockResolvedValue({ userId });
    (QUERIES.getFolderById as jest.Mock).mockResolvedValue(null);
    
    render(await IgnasStudioDrive({ 
      params: Promise.resolve({ folderId: '999' }) 
    }));
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('shows access denied when user is not folder owner', async () => {
    mockAuth.mockResolvedValue({ userId });
    (QUERIES.getFolderById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test Folder',
      ownerId: otherUserId,
      parent: null,
    });
    
    render(await IgnasStudioDrive({ 
      params: Promise.resolve({ folderId: '1' }) 
    }));
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('displays folder contents for authorized owner', async () => {
    // Set up auth and folder ownership
    mockAuth.mockResolvedValue({ userId });
    (QUERIES.getFolderById as jest.Mock).mockResolvedValue({
      id: 1, 
      name: 'My Files',
      ownerId: userId,
      parent: null,
    });
    
    // Empty folder structure
    (QUERIES.getFolders as jest.Mock).mockResolvedValue([]);
    (QUERIES.getFiles as jest.Mock).mockResolvedValue([]);
    (QUERIES.getAllParentsForFolder as jest.Mock).mockResolvedValue([]);
    
    render(await IgnasStudioDrive({ 
      params: Promise.resolve({ folderId: '1' }) 
    }));
    
    expect(screen.getByTestId('drive-contents')).toBeInTheDocument();
    expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
  });
});