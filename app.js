/* ==========================================================================
   LUMA LANDING & AUTHENTICATION SCRIPT
   - Navbar scroll effects
   - Mobile navigation toggle
   - Interactive assessment pathway tabs
   - Session checking & Navbar profile avatar swapping
   - Tabs toggle (Login / Signup) in auth.html
   - Password toggles (Show/Hide)
   - Live signup validation & strength meter
   - Mock authentication session management
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Auto logout on landing page load to always display Login & Sign Up buttons as requested
    if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '') {
        localStorage.removeItem('luma_logged_in');
        localStorage.removeItem('luma_user');
    }

    // --------------------------------------------------------------------------
    // 1. STICKY NAVBAR SCROLL ACTION
    // --------------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --------------------------------------------------------------------------
    // 2. MOBILE MENU NAVIGATION TOGGLE
    // --------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking links
        const navLinksList = document.querySelectorAll('.nav-link');
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 3. INTERACTIVE ASSESSMENT CAREER SWITCHER (landing page preview)
    // --------------------------------------------------------------------------
    const interestBtns = document.querySelectorAll('.interest-btn');
    const demoCards = document.querySelectorAll('.demo-result-card');

    interestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            interestBtns.forEach(b => b.classList.remove('active'));
            demoCards.forEach(c => {
                c.style.display = 'none';
                c.classList.remove('active');
            });

            btn.classList.add('active');

            const careerId = btn.getAttribute('data-career');
            const targetCard = document.getElementById(`demo-${careerId}`);
            if (targetCard) {
                targetCard.style.display = 'grid';
                void targetCard.offsetWidth;
                targetCard.classList.add('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 4. ACTIVE SECTION LINK HIGHLIGHT ON SCROLL
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));
    }

    // --------------------------------------------------------------------------
    // 5. SESSION CHECKING & PROFILE DROPDOWN TRANSITIONS
    // --------------------------------------------------------------------------
    const checkSession = () => {
        const loggedIn = localStorage.getItem('luma_logged_in') === 'true';
        
        const isAuthPage = window.location.pathname.includes('/discovery-assessment') || 
                           window.location.pathname.includes('/recommendations') || 
                           window.location.pathname.includes('/dashboard') || 
                           window.location.pathname.includes('/learning-hub') || 
                           window.location.pathname.includes('/learning-concept') ||
                           window.location.pathname.includes('/journey') ||
                           window.location.pathname.includes('/explorer-hub') ||
                           window.location.pathname.includes('/summary') ||
                           window.location.pathname.includes('/profile') ||
                           window.location.pathname.endsWith('/assessment.html') ||
                           window.location.pathname.endsWith('/recommendations.html') ||
                           window.location.pathname.endsWith('/dashboard.html') ||
                           window.location.pathname.endsWith('/learning.html') ||
                           window.location.pathname.endsWith('/learning-concept.html') ||
                           window.location.pathname.endsWith('/journey.html') ||
                           window.location.pathname.endsWith('/explorer.html') ||
                           window.location.pathname.endsWith('/summary.html') ||
                           window.location.pathname.endsWith('/profile.html');

        const isLoginPage = window.location.pathname === '/login' || 
                            window.location.pathname === '/signup' || 
                            window.location.pathname.endsWith('/auth.html');

        if (loggedIn && isLoginPage) {
            window.location.replace('/discovery-assessment');
            return;
        }

        if (!loggedIn && isAuthPage) {
            window.location.replace('/login');
            return;
        }
        
        // Grab navbar containers
        const actionsDesktop = document.getElementById('nav-actions-desktop-wrapper');
        const actionsMobile = document.getElementById('nav-actions-mobile-wrapper');
        const profileDesktop = document.getElementById('profile-menu-desktop');
        const profileMobile = document.getElementById('profile-menu-mobile');

        if (loggedIn) {
            const userStr = localStorage.getItem('luma_user');
            let user = { name: 'Amulya R.', email: 'you@example.com' };
            if (userStr) {
                user = JSON.parse(userStr);
            }

            // Hide standard actions
            if (actionsDesktop) actionsDesktop.style.display = 'none';
            if (actionsMobile) actionsMobile.style.display = 'none';

            // Show avatar menus
            if (profileDesktop) {
                profileDesktop.style.display = '';
                document.getElementById('dropdown-name-desktop').textContent = user.name;
                document.getElementById('dropdown-email-desktop').textContent = user.email;
            }
            if (profileMobile) {
                profileMobile.style.display = '';
                document.getElementById('dropdown-name-mobile').textContent = user.name;
                document.getElementById('dropdown-email-mobile').textContent = user.email;
            }
        } else {
            // Restore standard actions
            if (actionsDesktop) actionsDesktop.style.display = '';
            if (actionsMobile) actionsMobile.style.display = '';

            // Hide avatar menus
            if (profileDesktop) profileDesktop.style.display = 'none';
            if (profileMobile) profileMobile.style.display = 'none';
        }
    };

    checkSession();

    // Toggle dropdown visibility on clicking profile avatars
    const avatarBtnDesktop = document.getElementById('avatar-btn-desktop');
    const dropdownMenuDesktop = document.getElementById('dropdown-menu-desktop');
    if (avatarBtnDesktop && dropdownMenuDesktop) {
        avatarBtnDesktop.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenuDesktop.classList.toggle('active');
        });
        document.addEventListener('click', () => {
            dropdownMenuDesktop.classList.remove('active');
        });
    }

    const avatarBtnMobile = document.getElementById('avatar-btn-mobile');
    const dropdownMenuMobile = document.getElementById('dropdown-menu-mobile');
    if (avatarBtnMobile && dropdownMenuMobile) {
        avatarBtnMobile.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenuMobile.classList.toggle('active');
        });
    }

    // Bind log out buttons
    const logoutBtns = document.querySelectorAll('.logout-action-btn, #dash-logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('luma_logged_in');
            localStorage.removeItem('luma_user');
            
            const isAuthPath = window.location.pathname === '/login' || 
                               window.location.pathname === '/signup' || 
                               window.location.pathname === '/discovery-assessment' ||
                               window.location.pathname === '/recommendations' ||
                               window.location.pathname === '/dashboard' ||
                               window.location.pathname === '/learning-hub' ||
                               window.location.pathname === '/learning-concept' ||
                               window.location.pathname === '/journey' ||
                               window.location.pathname === '/explorer-hub' ||
                               window.location.pathname === '/summary' ||
                               window.location.pathname === '/profile' ||
                               window.location.pathname.endsWith('/assessment.html') ||
                               window.location.pathname.endsWith('/recommendations.html') ||
                               window.location.pathname.endsWith('/dashboard.html') ||
                               window.location.pathname.endsWith('/learning.html') ||
                               window.location.pathname.endsWith('/learning-concept.html') ||
                               window.location.pathname.endsWith('/journey.html') ||
                               window.location.pathname.endsWith('/explorer.html') ||
                               window.location.pathname.endsWith('/summary.html') ||
                               window.location.pathname.endsWith('/profile.html');

            if (isAuthPath) {
                window.location.href = '/';
            } else {
                checkSession();
                if (dropdownMenuDesktop) dropdownMenuDesktop.classList.remove('active');
                if (dropdownMenuMobile) dropdownMenuMobile.classList.remove('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 6. AUTHENTICATION PAGES HANDLERS (auth.html)
    // --------------------------------------------------------------------------
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const panelLogin = document.getElementById('panel-login');
    const panelSignup = document.getElementById('panel-signup');

    if (tabLogin && tabSignup && panelLogin && panelSignup) {
        // Tab switching functions
        const activateLoginTab = (updateUrl = true) => {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            panelLogin.classList.add('active');
            panelSignup.classList.remove('active');
            if (updateUrl && window.location.pathname !== '/login') {
                history.pushState(null, '', '/login');
            }
        };

        const activateSignupTab = (updateUrl = true) => {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            panelSignup.classList.add('active');
            panelLogin.classList.remove('active');
            if (updateUrl && window.location.pathname !== '/signup') {
                history.pushState(null, '', '/signup');
            }
        };

        tabLogin.addEventListener('click', () => activateLoginTab());
        tabSignup.addEventListener('click', () => activateSignupTab());

        // Bind switching prompts at the bottom
        const linkToSignup = document.getElementById('link-go-to-signup');
        const linkToLogin = document.getElementById('link-go-to-login');
        if (linkToSignup) linkToSignup.addEventListener('click', (e) => { e.preventDefault(); activateSignupTab(); });
        if (linkToLogin) linkToLogin.addEventListener('click', (e) => { e.preventDefault(); activateLoginTab(); });

        // Route initially on page load based on pathname
        const syncTabWithUrl = () => {
            if (window.location.pathname === '/signup') {
                activateSignupTab(false);
            } else {
                activateLoginTab(false);
            }
        };

        syncTabWithUrl();

        // Listen for browser back/forward buttons
        window.addEventListener('popstate', syncTabWithUrl);
    }

    // --------------------------------------------------------------------------
    // 7. PASSWORD SHOW/HIDE TOGGLES
    // --------------------------------------------------------------------------
    const togglePwBtns = document.querySelectorAll('.password-toggle-icon');
    togglePwBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const eyeOff = btn.querySelector('.eye-off-svg');
            const eyeOn = btn.querySelector('.eye-on-svg');

            if (input && input.type === 'password') {
                input.type = 'text';
                if (eyeOff) eyeOff.style.display = 'none';
                if (eyeOn) eyeOn.style.display = 'block';
            } else if (input) {
                input.type = 'password';
                if (eyeOff) eyeOff.style.display = 'block';
                if (eyeOn) eyeOn.style.display = 'none';
            }
        });
    });

    // --------------------------------------------------------------------------
    // 8. SIGNUP PASSWORD LIVE CHECKER & STRENGTH METER
    // --------------------------------------------------------------------------
    const signupPassword = document.getElementById('signup-password');
    const ruleLength = document.getElementById('rule-length');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleNumber = document.getElementById('rule-number');
    const strengthBar = document.getElementById('strength-bar');

    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            const val = signupPassword.value;
            
            // Rules flags
            const hasLength = val.length >= 8;
            const hasUpper = /[A-Z]/.test(val);
            const hasNumber = /[0-9]/.test(val);

            // Toggle criteria styles
            if (hasLength) ruleLength.classList.add('met'); else ruleLength.classList.remove('met');
            if (hasUpper) ruleUpper.classList.add('met'); else ruleUpper.classList.remove('met');
            if (hasNumber) ruleNumber.classList.add('met'); else ruleNumber.classList.remove('met');

            // Calculate strength score
            let score = 0;
            if (hasLength) score++;
            if (hasUpper) score++;
            if (hasNumber) score++;

            // Update strength bar fill
            if (strengthBar) {
                // Clear active states
                strengthBar.className = 'strength-bar-fill';
                if (score === 1) {
                    strengthBar.classList.add('weak');
                } else if (score === 2) {
                    strengthBar.classList.add('medium');
                } else if (score === 3) {
                    strengthBar.classList.add('strong');
                }
            }
        });
    }

    // --------------------------------------------------------------------------
    // 9. SUBMIT MOCK ACTIONS & REDIRECTS
    // --------------------------------------------------------------------------
    const showLoginError = (message) => {
        const errorDiv = document.getElementById('login-error-msg');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    };

    const showSignupError = (message) => {
        const errorDiv = document.getElementById('signup-error-msg');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    };

    const triggerMockAuthRedirect = (name, email) => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            // Force reflow
            void loadingScreen.offsetWidth;
            loadingScreen.classList.add('active');
        }
        
        localStorage.setItem('luma_logged_in', 'true');
        localStorage.setItem('luma_user', JSON.stringify({
            name: name || 'Amulya R.',
            email: email || 'you@example.com'
        }));

        setTimeout(() => {
            window.location.replace('/discovery-assessment');
        }, 650); // 500-800ms loading duration
    };

    const formLogin = document.getElementById('form-login-action');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Clear previous errors
            const errorDiv = document.getElementById('login-error-msg');
            if (errorDiv) errorDiv.style.display = 'none';

            // Custom mock validation
            if (password.length < 8) {
                showLoginError('Invalid email or password. Password must be at least 8 characters long.');
                return;
            }

            triggerMockAuthRedirect('Amulya R.', email);
        });
    }

    const formSignup = document.getElementById('form-signup-action');
    if (formSignup) {
        formSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;

            // Clear previous errors
            const errorDiv = document.getElementById('signup-error-msg');
            if (errorDiv) errorDiv.style.display = 'none';

            // Enforce criteria checks
            const hasLength = password.length >= 8;
            const hasUpper = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);

            if (!hasLength || !hasUpper || !hasNumber) {
                showSignupError('Please ensure your password meets all strength criteria.');
                return;
            }

            if (password !== confirm) {
                showSignupError('Passwords do not match. Please verify.');
                return;
            }

            triggerMockAuthRedirect(name, email);
        });
    }

    // Bind Google mock buttons
    const googleBtns = document.querySelectorAll('#login-google-btn, #signup-google-btn');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            triggerMockAuthRedirect('Amulya R.', 'amulya.r@gmail.com');
        });
    });

    // --------------------------------------------------------------------------
    // 10. DASHBOARD AVATAR DROPDOWN (assessment.html)
    // --------------------------------------------------------------------------
    const dashAvatarBtn = document.getElementById('dash-avatar-btn');
    const dashAvatarDropdown = document.getElementById('dash-avatar-dropdown');
    if (dashAvatarBtn && dashAvatarDropdown) {
        dashAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dashAvatarDropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => {
            dashAvatarDropdown.classList.remove('active');
        });
    }
});
