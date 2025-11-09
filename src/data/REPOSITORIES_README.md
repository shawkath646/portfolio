# Repositories Data

This file contains structured data for all portfolio-related repositories.

## Structure

Each repository entry contains:
- `id`: Unique identifier for the repository
- `name`: Full repository name with owner (e.g., "@shawkath646/portfolio")
- `displayName`: Human-readable name for display purposes
- `description`: Detailed description of the repository's purpose
- `githubUrl`: Full URL to the GitHub repository
- `category`: Repository category (main, android, web-course, nextjs-project)
- `technologies`: Array of technologies used in the project
- `featured`: Boolean indicating if the repository should be featured
- `order`: Numerical order for sorting/display purposes

## Categories

- **main**: Main portfolio projects
- **android**: Android applications
- **web-course**: Web programming course projects
- **nextjs-project**: Next.js projects

## Helper Functions

- `getFeaturedRepositories()`: Returns only featured repositories
- `getRepositoriesByCategory(category)`: Returns repositories filtered by category
- `getAllRepositories()`: Returns all repositories sorted by order
- `getRepositoryById(id)`: Finds a specific repository by its ID

## Usage Example

```typescript
import { 
  repositories, 
  getFeaturedRepositories, 
  getRepositoriesByCategory 
} from '@/data/repositories';

// Get all featured repositories
const featured = getFeaturedRepositories();

// Get all web course projects
const webCourseProjects = getRepositoriesByCategory('web-course');

// Access all repositories
const allRepos = repositories;
```

## Repositories List

1. **Personal Portfolio** - Main Next.js portfolio website
2. **Portfolio Android App** - Native Android application
3. **Science Club Management** - Next.js club management project
4. **Hi-Mart Frontend** - E-commerce frontend (web course)
5. **Hi-Mart Backend** - E-commerce backend (web course)
6. **Web Programming Assignment** - Course assignment project
7. **Web Programming Midterm** - Midterm project
