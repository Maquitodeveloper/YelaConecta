document.addEventListener('DOMContentLoaded', () => {
    // Array de objetos para e-commerce: {id, name, price, quantity}
    let cart = [];
    
    // Nodos del DOM
    const cartSidebar = document.getElementById('cart-sidebar');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    // 1. Lógica de Filtrado E-commerce
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar clase activa
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            products.forEach(product => {
                if (filterValue === 'todos' || product.getAttribute('data-category') === filterValue) {
                    product.style.display = 'flex';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // 2. Lógica del Carrito (Apertura/Cierre)
    openCartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));

    // 3. Agregar al Carrito (Manejo de Cantidades)
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            // Buscar si ya existe en el carrito
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            
            updateCartUI();
            
            Swal.fire({
                title: 'Activo Añadido',
                text: `${name} agregado a su portafolio.`,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                background: '#0A1128',
                color: '#FFFFFF'
            });
            
            cartSidebar.classList.add('active');
        });
    });

    // 4. Actualizar Interfaz del Carrito
    function updateCartUI() {
        cartItemsList.innerHTML = '';
        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-msg">Su bóveda está vacía.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                totalItems += item.quantity;

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info" style="flex-grow: 1;">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem('${item.id}')" title="Eliminar">🗑️</button>
                `;
                cartItemsList.appendChild(div);
            });
        }

        // Actualizar Totales
        cartCountBadge.innerText = totalItems;
        cartSubtotal.innerText = `$${subtotal.toFixed(2)}`;
        cartTotalPrice.innerText = `$${subtotal.toFixed(2)}`; // Aquí podrías sumar impuestos si quisieras
    }

    // Funciones globales para botones onclick dentro de los items inyectados
    window.updateQuantity = (id, change) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            updateCartUI();
        }
    };

    window.removeItem = (id) => {
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
    };

    // 5. Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            Swal.fire('Atención', 'Debe seleccionar al menos un servicio para iniciar el proceso.', 'warning');
            return;
        }

        Swal.fire({
            title: 'Procesamiento Seguro',
            text: 'Está a punto de iniciar un protocolo de contratación. Será redirigido a la pasarela de pagos.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#C5A059',
            cancelButtonColor: '#0A1128',
            confirmButtonText: 'Proceder al Pago'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Orden Creada', 'Redirigiendo a pasarela encriptada...', 'success');
                cart = [];
                updateCartUI();
                cartSidebar.classList.remove('active');
            }
        });
    });
});
