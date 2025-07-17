// Sayfa yüklendiğinde çalıştırılacak fonksiyonlar
function initializePage() {
    console.log('initializePage called');
    loadHeaderAndFooter();
}

// Header ve Footer yükleme fonksiyonu
async function loadHeaderAndFooter() {
    console.log('loadHeaderAndFooter started');
    
    try {
        // Header yükleme
        console.log('Fetching header.html...');
        const headerResponse = await fetch('./header.html');
        console.log('Header response status:', headerResponse.status);
        
        if (!headerResponse.ok) {
            throw new Error(`Header fetch failed: ${headerResponse.status}`);
        }
        
        const headerContent = await headerResponse.text();
        console.log('Header content length:', headerContent.length);
        
        const headerContainer = document.getElementById('header-container');
        console.log('Header container found:', !!headerContainer);
        
        if (headerContainer) {
            headerContainer.innerHTML = headerContent;
            console.log('Header content injected');
        }

        // Footer yükleme
        console.log('Fetching footer.html...');
        const footerResponse = await fetch('./footer.html');
        console.log('Footer response status:', footerResponse.status);
        
        if (!footerResponse.ok) {
            throw new Error(`Footer fetch failed: ${footerResponse.status}`);
        }
        
        const footerContent = await footerResponse.text();
        console.log('Footer content length:', footerContent.length);
        
        const footerContainer = document.getElementById('footer-container');
        console.log('Footer container found:', !!footerContainer);
        
        if (footerContainer) {
            footerContainer.innerHTML = footerContent;
            console.log('Footer content injected');
        }

        // Header yüklendikten sonra event listener'ları yeniden bağla
        console.log('Setting up event listeners...');
        setTimeout(() => {
            initializeLanguageSwitcher();
            initializeMobileMenu();
        }, 100);
        
        console.log('Header and footer loading completed successfully');
    } catch (error) {
        console.error('Header veya Footer yüklenemedi:', error);
        
        // Fallback: if fetch fails, try loading synchronously
        console.log('Attempting fallback loading...');
        loadHeaderAndFooterFallback();
    }
}

// Fallback yükleme fonksiyonu
function loadHeaderAndFooterFallback() {
    console.log('Using fallback loading method');
    
    // Try loading with XMLHttpRequest as fallback
    const xhr1 = new XMLHttpRequest();
    xhr1.open('GET', './header.html', true);
    xhr1.onreadystatechange = function() {
        if (xhr1.readyState === 4) {
            if (xhr1.status === 200) {
                const headerContainer = document.getElementById('header-container');
                if (headerContainer) {
                    headerContainer.innerHTML = xhr1.responseText;
                    console.log('Header loaded via XMLHttpRequest');
                }
            } else {
                console.error('Failed to load header via XMLHttpRequest:', xhr1.status);
            }
        }
    };
    xhr1.send();
    
    const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', './footer.html', true);
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4) {
            if (xhr2.status === 200) {
                const footerContainer = document.getElementById('footer-container');
                if (footerContainer) {
                    footerContainer.innerHTML = xhr2.responseText;
                    console.log('Footer loaded via XMLHttpRequest');
                    
                    // Initialize event listeners after both are loaded
                    setTimeout(() => {
                        initializeLanguageSwitcher();
                        initializeMobileMenu();
                    }, 200);
                }
            } else {
                console.error('Failed to load footer via XMLHttpRequest:', xhr2.status);
            }
        }
    };
    xhr2.send();
}

// Dil değiştirici fonksiyonu
function initializeLanguageSwitcher() {
    const langTrBtn = document.getElementById('lang-tr');
    const langEnBtn = document.getElementById('lang-en');
    
    if (!langTrBtn || !langEnBtn) return;
    
    // Set default language
    let currentLang = 'tr';
    
    // Function to update all translatable elements
    function updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-tr][data-en]');
        elements.forEach(element => {
            if (lang === 'tr') {
                element.textContent = element.getAttribute('data-tr');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        });
        
        // Update placeholders
        const inputs = document.querySelectorAll('[data-tr-placeholder][data-en-placeholder]');
        inputs.forEach(input => {
            if (lang === 'tr') {
                input.placeholder = input.getAttribute('data-tr-placeholder');
            } else {
                input.placeholder = input.getAttribute('data-en-placeholder');
            }
        });
        
        // Update select options
        const selects = document.querySelectorAll('select option[data-tr][data-en]');
        selects.forEach(option => {
            if (lang === 'tr') {
                option.textContent = option.getAttribute('data-tr');
            } else {
                option.textContent = option.getAttribute('data-en');
            }
        });
        
        // Update mobile menu elements if it exists
        const mobileMenu = document.querySelector('.fixed.inset-0.bg-white.z-50');
        if (mobileMenu) {
            const mobileElements = mobileMenu.querySelectorAll('[data-tr][data-en]');
            mobileElements.forEach(element => {
                if (lang === 'tr') {
                    element.textContent = element.getAttribute('data-tr');
                } else {
                    element.textContent = element.getAttribute('data-en');
                }
            });
        }
        
        // Update button styles
        if (lang === 'tr') {
            langTrBtn.classList.add('bg-primary', 'text-white', 'border-primary');
            langTrBtn.classList.remove('text-gray-600', 'border-gray-300');
            langEnBtn.classList.remove('bg-primary', 'text-white', 'border-primary');
            langEnBtn.classList.add('text-gray-600', 'border-gray-300');
        } else {
            langEnBtn.classList.add('bg-primary', 'text-white', 'border-primary');
            langEnBtn.classList.remove('text-gray-600', 'border-gray-300');
            langTrBtn.classList.remove('bg-primary', 'text-white', 'border-primary');
            langTrBtn.classList.add('text-gray-600', 'border-gray-300');
        }
        
        currentLang = lang;
    }
    
    // Event listeners for language buttons
    langTrBtn.addEventListener('click', function() {
        updateLanguage('tr');
    });
    
    langEnBtn.addEventListener('click', function() {
        updateLanguage('en');
    });
    
    // Initialize with Turkish
    updateLanguage('tr');
}

// Mobil menü fonksiyonu
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.md\\:hidden');
    if (!mobileMenuButton) return;

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'fixed inset-0 bg-white z-50 transform translate-x-full transition-transform duration-300 ease-in-out';
    mobileMenu.innerHTML = `
        <div class="flex justify-between items-center p-4 border-b">
            <h1 class="text-2xl font-['Pacifico'] text-primary">ademir</h1>
            <button class="w-10 h-10 flex items-center justify-center">
                <i class="ri-close-line ri-lg"></i>
            </button>
        </div>
        <div class="p-4">
            <nav class="flex flex-col space-y-4">
                <a href="index.html" class="text-gray-800 font-medium py-2 border-b border-gray-100" data-tr="Anasayfa" data-en="Home">Anasayfa</a>
                <a href="services.html" class="text-gray-800 font-medium py-2 border-b border-gray-100" data-tr="Hizmetlerimiz" data-en="Services">Hizmetlerimiz</a>
                <a href="doctors.html" class="text-gray-800 font-medium py-2 border-b border-gray-100" data-tr="Hekimlerimiz" data-en="Doctors">Hekimlerimiz</a>
                <a href="gallery.html" class="text-gray-800 font-medium py-2 border-b border-gray-100" data-tr="Galeri" data-en="Gallery">Galeri</a>
                <a href="contact.html" class="text-gray-800 font-medium py-2 border-b border-gray-100" data-tr="İletişim" data-en="Contact">İletişim</a>
            </nav>
            <div class="mt-6">
                <a href="https://wa.me/905312225213?text=Merhaba,%20diş%20kliniğiniz%20hakkında%20bilgi%20almak%20istiyorum." target="_blank" class="w-full bg-green-500 text-white px-6 py-3 !rounded-button font-medium hover:bg-green-600 transition-colors whitespace-nowrap inline-flex items-center gap-2 justify-center" data-tr="WhatsApp'tan Ulaş" data-en="Contact via WhatsApp">
                    <i class="ri-whatsapp-line ri-lg"></i>
                    WhatsApp'tan Ulaş
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.remove('translate-x-full');
    });
    
    const closeButton = mobileMenu.querySelector('button');
    closeButton.addEventListener('click', function() {
        mobileMenu.classList.add('translate-x-full');
    });
    
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('translate-x-full');
        });
    });
}

// Sayfa yüklendiğinde çalıştır - multiple fallbacks
console.log('Script loaded, setting up event listeners');

// Primary method: DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    initializePage();
});

// Fallback 1: if document is already loaded
if (document.readyState === 'loading') {
    console.log('Document is still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, initializing immediately');
    initializePage();
}

// Fallback 2: window.onload as last resort
window.addEventListener('load', function() {
    console.log('Window load event fired');
    // Only initialize if containers are still empty
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');
    
    if (headerContainer && headerContainer.innerHTML.trim() === '') {
        console.log('Header still empty on window load, trying again');
        initializePage();
    }
}); 