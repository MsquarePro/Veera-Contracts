/* Loads the shared header and footer into every page. Serve the site through a local web server. */
(async () => {
    const pageName = window.location.pathname.split('/').pop().toLowerCase() || 'home.html';

    async function mount(source, targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const response = await fetch(source);
        if (!response.ok) throw new Error(`Could not load ${source}`);

        const component = new DOMParser().parseFromString(await response.text(), 'text/html');
        component.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
            const copy = node.cloneNode(true);
            copy.dataset.sharedComponent = source;
            document.head.appendChild(copy);
        });
        target.innerHTML = component.body.innerHTML;
    }

    try {
        await Promise.all([mount('HEADER.html', 'site-header'), mount('FOOTER.html', 'site-footer')]);
        document.querySelectorAll('#site-header a[href], #site-footer a[href]').forEach((link) => {
            if (link.getAttribute('href').toLowerCase() === pageName) link.setAttribute('aria-current', 'page');
        });
        document.querySelectorAll('.site-footer-year').forEach((year) => { year.textContent = new Date().getFullYear(); });

        const header = document.querySelector('.site-header');
        const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
    } catch (error) {
        console.error('Shared layout could not be loaded. Open the site through a local web server.', error);
    }
})();
