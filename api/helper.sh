#!/bin/bash

# Define the directory structure
directories=(
    "src"
    "src/controllers"
    "src/middleware"
    "src/services"
    "src/config"
    "src/routes"
)

files=(
    "src/controllers/authController.js"
    "src/controllers/postController.js"
    "src/controllers/profileController.js"
    "src/middleware/authenticationMiddleware.js"
    "src/middleware/uploadMiddleware.js"
    "src/services/s3Service.js"
    "src/config/config.js"
    "src/routes/authRoutes.js"
    "src/routes/postRoutes.js"
    "src/routes/profileRoutes.js"
)

# Create directories
for dir in "${directories[@]}"; do
    mkdir -p "$dir"
done

# Create files
for file in "${files[@]}"; do
    touch "$file"
done