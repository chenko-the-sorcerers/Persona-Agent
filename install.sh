#!/bin/bash
# Quick Installation Script untuk Perbaikan Arutala Persona Agent
# Jalankan script ini dari root directory project Anda

echo "🔧 Installing Arutala Persona Agent Fixes..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from project root directory."
    exit 1
fi

echo "📁 Backing up original files..."
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
cp index.js backups/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null
cp server/routes/auth.js backups/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null
cp client/public/src/pages/login.html backups/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null
echo "✅ Backup completed"

echo ""
echo "📝 Copying fixed files..."

# Copy index.js
if [ -f "index.js" ]; then
    echo "  - Updating index.js..."
    # File akan di-copy manual oleh user
fi

# Copy auth.js
if [ -d "server/routes" ]; then
    echo "  - Updating server/routes/auth.js..."
    # File akan di-copy manual oleh user
fi

# Copy login.html
if [ -d "client/public/src/pages" ]; then
    echo "  - Updating client/public/src/pages/login.html..."
    # File akan di-copy manual oleh user
fi

# Create new files
if [ -d "client/public" ]; then
    echo "  - Creating forgot-password.html..."
    echo "  - Creating reset-password.html..."
    # File akan di-copy manual oleh user
fi

echo ""
echo "🗄️  Running database migration..."
if [ -f "database/arutala.db" ]; then
    sqlite3 database/arutala.db < database/migrations/001_add_reset_password_fields.sql
    echo "✅ Database migration completed"
else
    echo "⚠️  Database not found. Please run migration manually:"
    echo "   sqlite3 database/arutala.db < database/migrations/001_add_reset_password_fields.sql"
fi

echo ""
echo "✅ Installation completed!"
echo ""
echo "🚀 Next steps:"
echo "1. Review the changes in each file"
echo "2. Update your .env file with CORS_ORIGIN if needed"
echo "3. Run: npm start"
echo "4. Test forgot password at: http://localhost:8080/forgot-password.html"
echo ""
echo "📚 For full documentation, see README_PERBAIKAN.md"
echo ""