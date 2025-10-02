-- Connect Studio Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects table (video projects)
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    intro_text VARCHAR(500) DEFAULT 'In Loving Memory of',
    theme_id INTEGER,
    full_access_enabled BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, processing, completed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Media files table (photos, videos, audio)
CREATE TABLE IF NOT EXISTS media_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- image, video, audio
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_main_image BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Slides table (for video composition)
CREATE TABLE IF NOT EXISTS slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    media_file_id INTEGER,
    background_image VARCHAR(500),
    order_index INTEGER NOT NULL,
    duration FLOAT DEFAULT 3.0, -- seconds
    transition VARCHAR(50) DEFAULT 'fade',
    filters TEXT, -- JSON string for filters (saturation, blur, etc.)
    -- Text slide specific fields
    custom_text TEXT,
    custom_font VARCHAR(100) DEFAULT 'Montserrat',
    custom_color VARCHAR(20) DEFAULT '#000000',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (media_file_id) REFERENCES media_files(id) ON DELETE SET NULL
);

-- Themes table (predefined themes)
CREATE TABLE IF NOT EXISTS themes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    thumbnail_path VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default themes
INSERT OR IGNORE INTO themes (id, name, thumbnail_path) VALUES
(1, 'Theme 1', '/themes/theme1.png'),
(2, 'Theme 2', '/themes/theme2.png'),
(3, 'Theme 3', '/themes/theme3.png'),
(4, 'Theme 4', '/themes/theme4.png'),
(5, 'Theme 5', '/themes/theme5.png'),
(6, 'Theme 6', '/themes/theme6.png'),
(7, 'Theme 7', '/themes/theme7.png'),
(8, 'Theme 8', '/themes/theme8.png'),
(9, 'Theme 9', '/themes/theme9.png'),
(10, 'Theme 10', '/themes/theme10.png'),
(11, 'Theme 11', '/themes/theme11.png'),
(12, 'Theme 12', '/themes/theme12.png'),
(13, 'Theme 13', '/themes/theme13.png'),
(14, 'Theme 14', '/themes/theme14.png'),
(15, 'Theme 15', '/themes/theme15.png'),
(16, 'Theme 16', '/themes/theme16.png'),
(17, 'Theme 17', '/themes/theme17.png');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_media_files_project_id ON media_files(project_id);
CREATE INDEX IF NOT EXISTS idx_slides_project_id ON slides(project_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
