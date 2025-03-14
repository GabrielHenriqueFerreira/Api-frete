<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="icon.png">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="styles.css">
    <script defer src="responsive.js"></script>
    <title>Br Tools</title>
</head>
<body>
    <header>
        <a href="/home/gabriel/Downloads/site igor/index.html">
            <img src="logo.png" width="100px" height="100px" alt="Logo Br Tools">
        </a>
        <!-- Ícone de hambúrguer para telas menores -->
        <div class="menu-icon" id="menu-icon">
            <i class='bx bx-menu'></i> <!-- Ícone de hambúrguer do Boxicons -->
        </div>
        <!-- Menu de navegação -->
        <nav class="navbar" id="navbar">
            <ul>
                <li><a href="/home/gabriel/Downloads/site igor/index.html">Início</a></li>
                <li><a href="/produtos">Produtos</a></li>
                <li><a href="/sobre">Sobre Nós</a></li>
                <li><a href="/contato">Contato</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="page-title">Seu Carrinho</div>
        <div class="content">
            <section>
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Total</th>
                            <th>-</th>
                        </tr>
                    </thead>
                    <tbody id="carrinho-itens">
                        <!-- Itens do carrinho serão adicionados aqui dinamicamente -->
                    </tbody>
                </table>
                <div id="empty-cart-message" style="display: none;"></div>
            </section>
            <aside>
                <div class="box">
                    <header>Resumo da compra</header>
                    <div class="info">
                        <div><span>Sub-total</span><span id="subtotal">$ 0.00</span></div>
                        <div>
                            <span>Frete</span>
                            <span id="frete">$ 0.00</span>
                        </div>
               <div class="frete-input">
    <span>CEP</span>
    <input type="text" id="cep" placeholder="Digite seu CEP" maxlength="8" oninput="calcularFrete()">
    <div id="cep-error" class="error-message">CEP inválido ou não encontrado.</div>
    <div id="loading-spinner" class="loading-spinner">
        <i class='bx bx-loader-circle bx-spin'></i> Calculando frete...
    </div>
</div>
                    </div>
                    <footer>
                        <span>Total</span>
                        <span id="total">$ 0.00</span>
                    </footer>
                </div>
                <button>Finalizar compra</button>
            </aside>
        </div>
    </main>

    <script>
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const carrinhoItens = document.getElementById('carrinho-itens');
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cepError = document.getElementById('cep-error');
        const loadingSpinner = document.getElementById('loading-spinner');
        let frete = 0;

        function exibirCarrinho() {
            let subtotal = 0;
            carrinhoItens.innerHTML = '';

            if (carrinho.length === 0) {
                emptyCartMessage.style.display = 'block';
                subtotalElement.textContent = '$ 0.00';
                totalElement.textContent = '$ 0.00';
                return;
            } else {
                emptyCartMessage.style.display = 'none';
            }

            carrinho.forEach((produto, index) => {
                if (!produto.quantidade || isNaN(produto.quantidade)) {
                    produto.quantidade = 1;
                }

                const totalProduto = produto.preco * produto.quantidade;
                subtotal += totalProduto;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="product">
                            <img src="${produto.imagem}" alt="${produto.nome}" width="100" height="120">
                            <div class="info">
                                <div class="name">${produto.nome}</div>
                            </div>
                        </div>
                    </td>
                    <td>$${produto.preco.toFixed(2)}</td>
                    <td>
                        <div class="qty">
                            <button onclick="diminuirQuantidade(${index})"><i class='bx bx-minus'></i></button>
                            <span>${produto.quantidade}</span>
                            <button onclick="aumentarQuantidade(${index})"><i class='bx bx-plus'></i></button>
                        </div>
                    </td>
                    <td>$${totalProduto.toFixed(2)}</td>
                    <td>
                        <button class="remove" onclick="removerItem(${index})"><i class='bx bx-x'></i></button>
                    </td>
                `;
                carrinhoItens.appendChild(row);
            });

            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            atualizarTotal();
        }

        function atualizarTotal() {
            const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
            const total = subtotal + frete;
            totalElement.textContent = `$${total.toFixed(2)}`;
        }

        function aumentarQuantidade(index) {
            carrinho[index].quantidade += 1;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            exibirCarrinho();
        }

        function diminuirQuantidade(index) {
            if (carrinho[index].quantidade > 1) {
                carrinho[index].quantidade -= 1;
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                exibirCarrinho();
            }
        }

        function removerItem(index) {
            carrinho.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            exibirCarrinho();
        }

       async function verificarCidade(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        return data.localidade; // Retorna a cidade do CEP
    } catch (error) {
        console.error('Erro ao consultar CEP:', error);
        return null;
    }
}

async function calcularFrete() {
    const cep = document.getElementById('cep').value;
    const cepOrigem = "14408014"; // CEP da empresa

    if (!cep || cep.length !== 8 || isNaN(cep)) {
        cepError.style.display = 'block';
        frete = 0;
        atualizarTotal();
        return;
    } else {
        cepError.style.display = 'none';
    }

    const cidadeOrigem = await verificarCidade(cepOrigem);
    const cidadeDestino = await verificarCidade(cep);

    if (cidadeOrigem && cidadeDestino && cidadeOrigem === cidadeDestino) {
        frete = 0; // Frete grátis para a mesma cidade
        document.getElementById('frete').textContent = 'Gratuito'; // Exibe "Gratuito"
        atualizarTotal();
        return;
    }

    loadingSpinner.style.display = 'block'; // Mostra o spinner de carregamento

    const peso = 0.3;
    const altura = 4;
    const largura = 12;
    const comprimento = 17;

    try {
        const response = await fetch('https://api-frete-xz1n.onrender.com/calcular-frete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cepDestino: cep,
                cepOrigem: cepOrigem,
                peso: peso,
                altura: altura,
                largura: largura,
                comprimento: comprimento,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao calcular frete');
        }

        const data = await response.json();

        if (data && data.error && data.error.includes("mesma cidade")) {
            frete = 0; // Frete grátis para a mesma cidade
            document.getElementById('frete').textContent = 'Gratuito'; // Exibe "Gratuito"
        } else if (data && data.length > 0 && !isNaN(parseFloat(data[0].price))) {
            const precoFormatado = data[0].price.replace('R$', '').replace(',', '.').trim();
            frete = parseFloat(precoFormatado);
            document.getElementById('frete').textContent = `$${frete.toFixed(2)}`; // Exibe o valor do frete
        } else {
            frete = 0;
            alert('Não foi possível calcular o frete. Tente novamente mais tarde.');
        }
    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        frete = 0;
        alert('Erro ao calcular o frete. Tente novamente mais tarde.');
    } finally {
        loadingSpinner.style.display = 'none'; // Esconde o spinner de carregamento
    }

    atualizarTotal();
}

        exibirCarrinho();
    </script>

    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Sobre Nós</h3>
                <p>Br Tools é uma loja especializada em ferramentas de alta qualidade para profissionais e entusiastas.</p>
            </div>
            <div class="footer-section">
                <h3>Contatos</h3>
                <p> Pix: 42.721.573/0001-54</p>
                <br>
                <p>CNPJ: 42.721.573/0001-54</p>
                <br>
                <p>E-mail: josejunior71@gmail.com</p>
                <br>
                <p>Número de contato: +55 (16) 99192-8412</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Br Tools. Todos os direitos reservados.</p>
        </div>
    </footer>
</body>
</html>
