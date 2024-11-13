# Beat the Goblin

## Description
Beat the Goblin is a gamified task management application. 
The idea is to gently encourage the user to manage and finish their daily tasks using a "combat" against a goblin opponent as motivation.

## Key Features
- User authentication system
- Task management with XP tracking
- User profile with streaks and rewards
- Deadline management
- Versus screen comparing user and goblin XP
- Victory and challenge pages based on task completion : 
    - Breathing exercise timer for stress relief (challenge)
    - Pomodoro timer for focused work sessions (challenge)
- Interactive map (functionality to be implemented)

## Components

### Main Component
- Integrates various sub-components to create the main application interface
- Manages user authentication state
- Tracks XP for user and goblin opponent
- Handles deadline management
- Routes to victory or challenge pages based on conditions

### Deadline Component
- Allows users to view and edit the deadline
- Fetches and updates deadline through an API
- Displays a day/night cycle gif (future implementation)

### User Component
- Displays user information including username, avatar, streak, and rewards
- Integrates the Deadline component
- Shows current and longest streaks (placeholder functionality)
- Displays user rewards (placeholder functionality)

### VersusGoblin Component
- Visualizes the comparison between the user's XP and the goblin's XP 
by displaying a "Versus" text with color-coding based on XP comparison
- Shows the goblin's avatar and name

### Grimoire Component (Task Management)
- Handles task creation, updating, deletion, and completion
- Interacts with the server API for task operations
- Manages task reordering

## Installation
1. Clone the repository:
git clone https://github.com/SamJouini/Beat_the_Goblin


## Usage
1. Create an account or log in.
2. Add tasks to your Grimoire.
3. Complete tasks to gain XP and beat the goblin.
4. Manage your deadline and view your profile information.
5. Use the Pomodoro timer or breathing exercise when needed.
      
### Frontend
- Next.js
- React
- TypeScript
- CSS Modules
- @dnd-kit for drag-and-drop functionality
- Lodash for utility functions
  
### Backend
- Flask
- Flask-JWT-Extended for authentication
- SQLite3 for database management
- python-dotenv for environment variable management
  
## Future Improvements
- User profile editing capabilities
- Customizable Pomodoro and breathing exercise durations
- Sound notifications for timers
- More detailed task categorization and prioritization
- Dynamic streak calculation based on user activity
- Reward system
- Difficulty management for goblin opponent
- Accessibility improvements for color-blind users
- Randomized goblin names
- Day/night cycle visualization for deadline component

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License 
This project is licensed under the MIT License.
