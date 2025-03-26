# EduAssisst

## Overview

EduAssist is a web platform designed to empower users with personalized learning experiences by leveraging **LLMs** (Large Language Models) to generate quizzes on any topic of their choice. Users can create, customize, and attempt quizzes, making learning more interactive and tailored. The platform utilizes **Next.js** for the frontend, **Firebase** for authentication, real-time updates, and hosting, and **Tailwind CSS** for sleek, responsive styling. It also integrates **Firebase** for efficient data storage, ensuring that user progress, quiz results, and preferences are securely maintained. With EduAssist, learning becomes more engaging, flexible, and accessible.

Link to website: [placeholder](url)

## Table of Contents

1. [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Usage](#usage)
2. [Key Highlights](#key-highlights)
    - [Authentication](#authentication)
    - [Quiz Creation](#quiz-creation)
    - [Practice](#practice-mode)
    - [Leaderboard](#leaderboard)
3. [Contributing](#contributing)
4. [Bug Reporting](#bug-reporting)
5. [Tech Stack](#tech-stack)

## Getting Started
Backend: To build and run using docker, run the following commands
```
docker build -t eduassist_api:latest .
docker run -p 8000:8080 eduassist_api
```

## Key Highlights

### **Authentication**

EduAssist uses **Firebase Authentication** to securely manage user access. Users can create accounts, log in, and track their quiz history and progress. To make the platform accessible and convenient, **guest users** are also supported. This allows individuals to try out the platform and take quizzes without creating an account. However, guest users will have limited access to features, such as the inability to save progress or appear on the leaderboard. This ensures that registered users receive the full benefits of the platform, while guests can still enjoy a seamless trial experience.

### **Quiz Creation**

EduAssist leverages **LLMs (Large Language Models)** to generate quizzes from any prompt, making it highly flexible and customizable. Users can create quizzes on a wide range of topics, from academic subjects to general knowledge and niche interests.  
To ensure a **safe and appropriate experience**, EduAssist includes **guardrails** to filter out NSFW (Not Safe For Work) or inappropriate content. The system automatically detects and blocks prompts or quiz content that may contain offensive, harmful, or adult material, ensuring a family-friendly and educational environment.

### **Practice Mode**

EduAssist offers a **Practice Mode** for users who want to sharpen their skills without affecting their overall score. In this mode, users can generate and attempt quiz questions freely, providing a stress-free environment for learning and experimentation.  
Unlike regular quizzes, the **results from Practice Mode** are not recorded in the user’s score history or reflected on the leaderboard. This feature encourages students to practice as much as they want, improving their skills without worrying about their ranking.

### **Leaderboard**

To inspire healthy competition and motivation, EduAssist features a **Leaderboard** where students can see how they rank compared to their peers.  
The leaderboard displays metrics such as:

-   **Average score**: The cumulative points earned by each user.
-   **Top performers**: Highlighting the highest-scoring individuals.

By showcasing individual achievements, the leaderboard encourages users to stay engaged, challenge themselves, and strive for improvement, fostering a competitive yet educational community.

## Contributing

We welcome and appreciate contributions from the community! To contribute to EduAssist, please follow these guidelines:

1. Fork the repository to your own GitHub account.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature` or `git checkout -b bugfix/your-bug-fix`.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork: `git push origin feature/your-feature`.
5. Open a Pull Request (PR) against the `main` branch of this repository.
6. Ensure that your PR description clearly describes the problem and solution.

### Code Style

Follow the existing code style and conventions. Ensure your code is well-documented.

### Reporting Issues

If you encounter any issues or have suggestions, please report them on the [Issues](https://github.com/CodinJack/EduAssist/issues) page.

### Development Environment

To set up your development environment, refer to the [Getting Started](#getting-started) section.

Thank you for contributing to EduAssist! 🌿

## Bug Reporting

If you encounter any bugs, glitches, or unexpected behavior while using EduAssist, we appreciate your help in improving the project. Please follow these guidelines when reporting issues:

1. Check the [existing issues](https://github.com/CodinJack/EduAssist/issues) to ensure the bug hasn't been reported before.

2. If your issue is not already reported, open a new issue and provide the following details:

    - **Title:** A concise and descriptive title.

    - **Description:** Clearly describe the issue, including steps to reproduce it.

    - **Expected Behavior:** What you expected to happen.

    - **Actual Behavior:** What actually happened.

    - **Screenshots or Code Snippets:** If applicable, include screenshots or code snippets to help illustrate the issue.

3. Assign appropriate labels to your issue, such as "bug" or "enhancement," to help categorize and prioritize it.

4. If you're able to address the issue yourself, feel free to open a Pull Request (PR) with the fix. Follow the [Contributing Guidelines](#contributing) for PR submissions.

Thank you for helping make EduAssist better! 🌱

## Tech Stack

EduAssist is built using the following technologies:

-   **Next.js**: A React-based framework for building fast and scalable web applications, offering server-side rendering and static site generation.
-   **Django**: A high-level Python web framework used for building the backend, handling business logic, and serving the API for EduAssist.
-   **Firebase**: A comprehensive platform for building web applications, including authentication, real-time updates, and hosting services.
-   **Tailwind CSS**: A utility-first CSS framework for creating sleek, responsive, and modern designs.
-   **Firestore**: A NoSQL cloud database used for storing quiz data, user profiles, and progress efficiently.

### Frontend

-   **Next.js (React)**: The frontend is built with Next.js, providing a dynamic, interactive, and performant user interface.
-   **Tailwind CSS**: Tailwind CSS is used for styling, enabling a streamlined and customizable design approach.

### Backend

-   **Django**: Uses Django Rest Framework for API that handle backend logic, such as quiz generation and data retrieval.
-   **Firebase Authentication**: Provides secure user authentication for EduAssist.
-   **Firestore**: Serves as the backend database, efficiently storing and retrieving user profiles, quiz data, and scores.

### Additional Tools

-   **npm**: The package manager for JavaScript, used for installing and managing project dependencies.

-   **Git**: Version control system for tracking changes in the source code.

-   **Google Cloud**: For hosting our website, cloud storage, authentication, and Maps.

### Development Environment

To set up your development environment, refer to the [Getting Started](#getting-started) section.
