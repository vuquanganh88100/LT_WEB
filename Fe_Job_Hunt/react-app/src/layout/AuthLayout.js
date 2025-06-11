// src/components/layout/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundImage: 'url(https://asset.gecdesigns.com/img/background-templates/abstract-wavy-purple-and-pink-gradient-background-design-sr31012402-1706715431755-cover.webp)', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
            }}
        >
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: 32,
                    borderRadius: 12,
                    width: '100%',
                    maxWidth: 400,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;