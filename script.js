document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    const sidebar = document.getElementById('cart-sidebar');
    const cartList = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('cart-total-price');
    const badge = document.getElementById('cart-count-badge');

    // Abrir/Cerrar Carrito
    document.getElementById('open-cart-btn').onclick = () => sidebar.classList.add('active');
    document.getElementById('close-cart-btn').onclick = () => sidebar.classList.remove('active');

    // Agregar al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.onclick = () => {
            const item = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price)
            };
            cart.push(item);
            updateUI();
            sidebar.classList.add('active');
        };
    });

    function updateUI() {
        cartList.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            cartList.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <span>${item.name}</span>
                    <strong>$${item.price}</strong>
                </div>
            `;
        });
        totalPriceElement.innerText = `$${total.toFixed(2)}`;
        badge.innerText = cart.length;
    }

    // Checkout WhatsApp
    document.getElementById('checkout-btn').onclick = () => {
        if (cart.length === 0) return Swal.fire('Carrito vacío', '', 'info');

        let text = "Hola YelaConecta, me interesa contratar:\n";
        cart.forEach(i => text += `- ${i.name} ($${i.price})\n`);
        text += `\nTotal: ${totalPriceElement.innerText}\n\nSolicito información para iniciar.`;

        const url = `https://wa.me/584129884284?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.display = (filter === 'todos' || card.dataset.category === filter) ? 'flex' : 'none';
            });
        };
    });
});
