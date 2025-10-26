@echo off
echo 🎨 Installing Modern UI Libraries for SkillChain...

echo.
echo ============================================
echo Installing Frontend Dependencies
echo ============================================
cd frontend

echo Installing Radix UI components...
call npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-progress @radix-ui/react-tooltip @radix-ui/react-avatar @radix-ui/react-badge

echo Installing utility libraries...
call npm install class-variance-authority clsx tailwind-merge

echo Installing Mapbox for maps...
call npm install mapbox-gl react-map-gl

echo Installing animation libraries...
call npm install useanimations

echo Installing form libraries...
call npm install react-hook-form @hookform/resolvers zod

echo Installing UI enhancement libraries...
call npm install sonner vaul cmdk embla-carousel-react

echo Installing additional Tailwind plugins...
call npm install @tailwindcss/typography @tailwindcss/aspect-ratio

cd ..

echo.
echo ============================================
echo Installation Complete!
echo ============================================
echo.
echo Your SkillChain application now has:
echo ✅ ShadCN UI Components
echo ✅ Radix UI Primitives  
echo ✅ Modern Animations
echo ✅ Mapbox Integration
echo ✅ Form Validation
echo ✅ Enhanced TailwindCSS
echo.
echo Run the application with:
echo start-all-fixed.bat
echo.
pause



