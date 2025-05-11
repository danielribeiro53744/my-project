'use client';

import { useAuth } from '@/lib/stores/auth';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, DashboardIcon } from '@radix-ui/react-icons';

export default function SwaggerPage() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

    if (user && user.role !== 'admin') {
      window.location.href = '/shop';
    } else if (!user) {
      window.location.href = '/login';
    }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      const style = document.createElement('style');
      style.id = 'swagger-dark-theme';
      style.textContent = `
        .swagger-ui { 
          background: #1e1e1e; 
          color: #eee; 
        }
        .swagger-ui .opblock { 
          background: #2d2d2d; 
          border-color: #444; 
        }
        .swagger-ui .opblock .opblock-summary-path { 
          color: #eee; 
        }
        .swagger-ui .opblock .opblock-summary-description { 
          color: #aaa; 
        }
        .swagger-ui .opblock-tag { 
          color: #eee; 
        }
        .swagger-ui .info .title { 
          color: #eee; 
        }
        .swagger-ui .info li, .swagger-ui .info p, .swagger-ui .info table { 
          color: #aaa; 
        }
        .swagger-ui .scheme-container { 
          background: #2d2d2d; 
          border-color: #444; 
        }
        .swagger-ui .btn { 
          background: #333; 
          color: #eee; 
        }
        .swagger-ui .model-title { 
          color: #eee; 
        }
      `;
      document.head.appendChild(style);
    } else {
      document.documentElement.classList.remove('dark');
      const style = document.getElementById('swagger-dark-theme');
      if (style) {
        style.remove();
      }
    }
  }, [darkMode]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* Enhanced Header Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        padding: '1.5rem',
        backgroundColor: darkMode ? '#2d2d2d' : '#f8fafc',
        borderBottom: darkMode ? '1px solid #444' : '1px solid #e2e8f0',
        boxShadow: darkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Admin Dashboard Button */}
        <Button
          variant={darkMode ? 'secondary' : 'outline'}
          size="lg"
          onClick={() => window.location.href = '/admin'}
          style={{
            padding: '0.75rem 1.75rem',
            borderRadius: '8px',
            border: darkMode ? '1px solid #444' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 500
          }}
        >
          <DashboardIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          <span>Admin Dashboard</span>
        </Button>

        {/* Theme Toggle Button */}
        <Button
          variant={darkMode ? 'default' : 'outline'}
          size="lg"
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '0.75rem 1.75rem',
            borderRadius: '8px',
            border: darkMode ? '1px solid transparent' : '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 500
          }}
        >
          {darkMode ? (
            <>
              <SunIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <MoonIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Dark Mode</span>
            </>
          )}
        </Button>
      </div>
      
      <SwaggerUI url="/api/docs" />
    </div>
  );
}