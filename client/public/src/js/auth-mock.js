// ═══════════════════════════════════════════════════════════
// MOCK AUTH - FOR TESTING WITHOUT BACKEND
// ═══════════════════════════════════════════════════════════

/**
 * Mock Authentication for Development/Testing
 * Remove this in production and use real API
 */

// Add to AuthService class (or create separate mock service)
class MockAuthService extends AuthService {
    /**
     * Override adminLogin for mock testing
     */
    async adminLogin(email, password) {
      console.log('🧪 MOCK: Admin login attempt', email);
  
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
  
      // Mock admin credentials for testing
      const mockAdmins = [
        {
          email: 'admin@arutala.com',
          password: 'admin123',
          user: {
            id: 'admin_001',
            email: 'admin@arutala.com',
            name: 'Admin Arutala',
            role: 'admin',
            avatar: null
          }
        },
        {
          email: 'test@admin.com',
          password: 'test123',
          user: {
            id: 'admin_002',
            email: 'test@admin.com',
            name: 'Test Admin',
            role: 'admin',
            avatar: null
          }
        }
      ];
  
      // Find matching admin
      const admin = mockAdmins.find(a => a.email === email && a.password === password);
  
      if (admin) {
        // Generate mock JWT token
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        // Store auth data
        this.setAuth(mockToken, admin.user);
  
        console.log('✅ MOCK: Admin authenticated', admin.user);
  
        return {
          success: true,
          user: admin.user
        };
      }
  
      console.log('❌ MOCK: Invalid credentials');
      return {
        success: false,
        error: 'Invalid admin credentials'
      };
    }
  
    /**
     * Override login for mock testing
     */
    async login(email, password) {
      console.log('🧪 MOCK: User login attempt', email);
  
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
  
      // Mock user credentials
      const mockUsers = [
        {
          email: 'user@test.com',
          password: 'user123',
          user: {
            id: 'user_001',
            email: 'user@test.com',
            name: 'Test User',
            role: 'user',
            avatar: null
          }
        }
      ];
  
      const user = mockUsers.find(u => u.email === email && u.password === password);
  
      if (user) {
        const mockToken = 'mock_jwt_token_' + Date.now();
        this.setAuth(mockToken, user.user);
  
        console.log('✅ MOCK: User authenticated', user.user);
  
        return {
          success: true,
          user: user.user
        };
      }
  
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
  
    /**
     * Override validateToken for mock
     */
    async validateToken() {
      // Always return true for mock
      return true;
    }
  
    /**
     * Override API calls for mock
     */
    async post(endpoint, data = {}) {
      console.log('🧪 MOCK API POST:', endpoint, data);
  
      // Return success for mock
      return {
        success: true,
        message: 'Mock response'
      };
    }
  }
  
  // USE MOCK SERVICE FOR TESTING
  // Comment out this line in production:
  window.authService = new MockAuthService();
  
  console.log('🧪 MOCK AUTH SERVICE ENABLED');
  console.log('📝 Test Credentials:');
  console.log('   Admin: admin@arutala.com / admin123');
  console.log('   Admin: test@admin.com / test123');
  console.log('   User:  user@test.com / user123');