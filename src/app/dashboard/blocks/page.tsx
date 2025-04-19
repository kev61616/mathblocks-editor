'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useBlocksManager } from '@/hooks/useBlocksManager';
import { UIBlock } from '@/types/block-types';

// UI Components
import BlockFilterBar from '@/components/blocks/ui/BlockFilterBar';
import BlocksList from '@/components/blocks/ui/BlocksList';

// Dialog Components
import CreateBlockDialog from '@/components/blocks/dialogs/CreateBlockDialog';
import EditBlockDialog from '@/components/blocks/dialogs/EditBlockDialog';
import RenameBlockDialog from '@/components/blocks/dialogs/RenameBlockDialog';
import DeleteBlockDialog from '@/components/blocks/dialogs/DeleteBlockDialog';
import PreviewBlockDialog from '@/components/blocks/dialogs/PreviewBlockDialog';

export default function BlocksManagementPage() {
  // Use our custom hook for block management
  const {
    filteredBlocks,
    searchQuery,
    activeCategory,
    setSearchQuery,
    setActiveCategory,
    categories,
    duplicateBlock,
    deleteBlock,
    updateBlock,
    createBlock
  } = useBlocksManager();

  // Dialog states
  const [selectedBlock, setSelectedBlock] = useState<UIBlock | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  // Block operation handlers
  const handleEditClick = (block: UIBlock) => {
    setSelectedBlock(block);
    setIsEditDialogOpen(true);
  };

  const handlePreviewClick = (block: UIBlock) => {
    setSelectedBlock(block);
    setIsPreviewDialogOpen(true);
  };

  const handleRenameClick = (block: UIBlock) => {
    setSelectedBlock(block);
    setIsRenameDialogOpen(true);
  };

  const handleDeleteClick = (block: UIBlock) => {
    setSelectedBlock(block);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveParameters = (blockId: string, parameters: Record<string, unknown>) => {
    updateBlock(blockId, { parameters });
  };

  const handleRename = (blockId: string, name: string, description: string) => {
    updateBlock(blockId, { name, description });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  const handleUseInProject = (block: UIBlock) => {
    // In a real implementation, this would redirect to a project editor with this block
    alert(`Block "${block.name}" would be added to a project.`);
  };

  // Check if any filters are applied
  const hasFiltersApplied = searchQuery !== '' || activeCategory !== 'All';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Block Library</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create New Block
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <BlockFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          hasFiltersApplied={hasFiltersApplied}
          onClearFilters={handleClearFilters}
        />

        {/* Blocks List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <BlocksList
            blocks={filteredBlocks}
            onEditClick={handleEditClick}
            onPreviewClick={handlePreviewClick}
            onDuplicateClick={duplicateBlock}
            onRenameClick={handleRenameClick}
            onDeleteClick={handleDeleteClick}
            onUseClick={handleUseInProject}
          />
        </div>
      </main>

      {/* Dialogs */}
      <CreateBlockDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateBlock={createBlock}
      />

      <EditBlockDialog
        block={selectedBlock}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSaveChanges={handleSaveParameters}
      />

      <RenameBlockDialog
        block={selectedBlock}
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        onRename={handleRename}
      />

      <DeleteBlockDialog
        block={selectedBlock}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={deleteBlock}
      />

      <PreviewBlockDialog
        block={selectedBlock}
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
      />
    </div>
  );
}
