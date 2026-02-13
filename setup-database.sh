#!/bin/bash

# ================================================================
# Arutala Persona Agent - Database Setup Script
# ================================================================

echo "🗄️  Arutala Persona Agent - Database Setup"
echo "==========================================="
echo ""

# Check if sqlite3 is installed
if ! command -v sqlite3 &> /dev/null; then
    echo "❌ Error: sqlite3 is not installed"
    echo "   Install it with: brew install sqlite (macOS) or apt-get install sqlite3 (Linux)"
    exit 1
fi

# Create database directory if not exists
if [ ! -d "database" ]; then
    echo "📁 Creating database directory..."
    mkdir -p database
fi

DB_PATH="database/arutala.db"

# Backup existing database if exists
if [ -f "$DB_PATH" ]; then
    echo "⚠️  Database already exists!"
    read -p "   Do you want to backup and reinitialize? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        BACKUP_PATH="database/arutala.db.backup.$(date +%Y%m%d_%H%M%S)"
        echo "💾 Backing up to: $BACKUP_PATH"
        cp "$DB_PATH" "$BACKUP_PATH"
        rm "$DB_PATH"
    else
        echo "❌ Setup cancelled"
        exit 0
    fi
fi

# Initialize database
echo "🚀 Initializing database..."
if [ -f "database/init_database.sql" ]; then
    sqlite3 "$DB_PATH" < database/init_database.sql
    if [ $? -eq 0 ]; then
        echo "✅ Database initialized successfully!"
        echo ""
        echo "📊 Database info:"
        echo "   Path: $DB_PATH"
        echo "   Admin email: admin@arutala.com"
        echo "   Admin password: admin123"
        echo ""
        echo "⚠️  IMPORTANT: Change admin password in production!"
        echo ""
        echo "🎉 Setup complete! You can now run: npm start"
    else
        echo "❌ Error initializing database"
        exit 1
    fi
else
    echo "❌ Error: database/init_database.sql not found"
    exit 1
fi
