# MathBlocks Editor: Project Architecture

## Overview

MathBlocks Editor is a specialized application designed to transform static HTML math content into interactive, engaging components for high school students. The system analyzes existing HTML content, identifies potential interactive elements, and provides tools to convert them into reusable, configurable blocks.

## Architecture Diagram

```mermaid
graph TD
    subgraph "Frontend"
        UI[UI Components]
        Editor[Editor Interface]
        Preview[Preview System]
        Blocks[Block Components]
    end
    
    subgraph "Core Services"
        CA[Content Analysis]
        TR[HTML Transformation]
        BM[Block Management]
        PM[Project Management]
    end
    
    subgraph "Data"
        DB[(Project Storage)]
        Templates[(Block Templates)]
    end
    
    UI --> Editor
    UI --> Preview
    Editor --> Blocks
    Preview --> Blocks
    
    Editor --> CA
    Editor --> TR
    Editor --> BM
    Editor --> PM
    
    CA --> DB
    TR --> DB
    BM --> DB
    PM --> DB
    
    Blocks --> Templates
    BM --> Templates
```

## Core Subsystems

### 1. UI Layer

- **Dashboard:** Project management interface
- **Editor:** Block configuration and customization
- **Preview:** Real-time rendering of interactive blocks
- **Component Library:** UI components following design system

### 2. Core Services

- **Content Analysis:** Parses HTML to identify potential interactive elements
- **HTML Transformation:** Converts static HTML elements to interactive blocks
- **Block Management:** Handles the creation, updating, and deletion of blocks
- **Project Management:** Manages projects, files, and user settings

### 3. Data Layer

- **Project Storage:** Persists project data and configurations
- **Block Templates:** Pre-defined block types with default configurations
- **Export System:** Generates standalone HTML/JS for use in various platforms

## Technical Stack

- **Framework:** Next.js 15 with App Router
- **UI Components:** Radix UI primitives with custom styling
- **Styling:** TailwindCSS for utility-first styling
- **State Management:** React Context + Reducers for application state
- **Content Parsing:** Custom HTML parser with heuristics for math content
- **Math Rendering:** MathJax/KaTeX for equation rendering
- **Interactive Elements:** Custom React components with D3.js for visualizations

## Directory Structure

```
mathblocks-editor/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/              # Base UI components
│   │   ├── blocks/          # Interactive block implementations
│   │   ├── editor/          # Editor-specific components
│   │   └── wizards/         # Multi-step wizards for complex operations
│   ├── lib/                 # Core utilities and services
│   │   ├── block-templates/ # Block type definitions and defaults
│   │   ├── content-analysis/# HTML parsing and analysis
│   │   ├── transformers/    # HTML to block transformers
│   │   └── utils/           # General utility functions
│   └── public/              # Static assets
└── planning/                # Architecture and design documents
```

## Key Workflows

### Content Import and Analysis

```mermaid
sequenceDiagram
    actor User
    participant UI as Editor UI
    participant CA as Content Analyzer
    participant TR as Transformer
    participant BM as Block Manager
    
    User->>UI: Import HTML content
    UI->>CA: Parse HTML
    CA->>UI: Return element analysis
    UI->>User: Display analysis results
    User->>UI: Select elements to transform
    UI->>TR: Transform elements to blocks
    TR->>BM: Create block instances
    BM->>UI: Return created blocks
    UI->>User: Display transformed blocks
```

### Block Editing and Configuration

```mermaid
sequenceDiagram
    actor User
    participant UI as Editor UI
    participant PM as Properties Manager
    participant PR as Preview Renderer
    
    User->>UI: Select block to edit
    UI->>PM: Get block properties
    PM->>UI: Return property configuration
    UI->>User: Display property controls
    User->>UI: Modify properties
    UI->>PM: Update block properties
    PM->>PR: Re-render with new properties
    PR->>UI: Return updated preview
    UI->>User: Display updated block
```

## Security and Performance Considerations

- **Content Sandboxing:** Preview execution in isolated context
- **Input Validation:** Validate all user inputs for configuration
- **Performance Optimization:** Lazy loading of block components
- **Caching Strategy:** Cache block templates and rendered content

## Future Extensibility

- **Plugin System:** Allow for custom block types
- **API Integration:** Connect to LMS and other educational platforms
- **Collaborative Editing:** Multi-user simultaneous editing
- **Analytics Integration:** Track student interaction with blocks
