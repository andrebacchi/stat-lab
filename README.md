# STAT LAB

**Laboratório prático e visual de estatística descritiva e inferencial para o ensino em saúde.**

Criado por **André Demambre Bacchi** (Universidade Federal de Rondonópolis).

👉 Acesse: **https://andrebacchi.github.io/stat-lab/**

Versão piloto 0.9 (setembro de 2026).

## O que é

Um laboratório em que o aluno coloca números, mexe nos controles e vê o que acontece. O foco é entender os conceitos, não decorar fórmulas.

**Estatística descritiva**
- Tipos de variáveis (quiz com 30 exemplos) e como descrever cada uma
- Tendência central, dispersão e boxplot, formas de distribuição
- Distribuição normal: áreas, percentis e escore z
- Probabilidade: lei dos grandes números, regras do “E” e do “OU”, probabilidade × chance
- Bancada de dados: qualquer sequência de números, com gráficos, medidas e passo a passo

**Estatística inferencial**
- Amostras e Teorema Central do Limite, tipos de amostragem
- Intervalo de confiança: simulação de 100 estudos e calculadoras
- Teste de hipótese: o chá de Fisher, a dança dos valores de p, poder
- Guia “Qual teste usar?”
- Laboratório com 20 testes (t, Mann-Whitney, Wilcoxon, ANOVA, Kruskal-Wallis, medidas repetidas, Friedman, correlações, qui-quadrado, Fisher, McNemar, regressão linear e logística, Kaplan-Meier e log-rank, entre outros), com gráficos, resultado, frase para relatar e simulação de mil estudos
- Múltiplas comparações e significância estatística × relevância clínica

Também: glossário de símbolos, “Saiba mais” em cada painel, modo Essencial/Completo, colar dados do Excel, instalação como aplicativo e uso sem internet depois da primeira visita.

Os cálculos seguem os mesmos métodos do R e do jamovi (conferidos com scipy e statsmodels). Ferramenta didática: não substitui software estatístico em pesquisa.

## Como atualizar

1. Substitua o arquivo `index.html` pela nova versão (Add file → Upload files).
2. Em `sw.js`, aumente o número da versão (por exemplo, `stat-lab-v1` → `stat-lab-v2`) para os aparelhos baixarem a atualização.

## Como citar

Bacchi AD. *STAT LAB: laboratório prático de estatística para o ensino em saúde* [aplicativo web]. Versão 0.9. 2026. Disponível em: https://andrebacchi.github.io/stat-lab/

## Licença

CC BY 4.0: pode ser usado e adaptado, com atribuição ao autor.

## Como editar

O código-fonte fica em `src/` (um arquivo por laboratório, mais `style.css`, `body.html` e `head.html`).
Depois de editar, rode `sh build.sh` para gerar o `index.html` e aumente a versão no `sw.js`.
`tools/` tem os scripts que conferem os testes estatísticos contra scipy/statsmodels.
