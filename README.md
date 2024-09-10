# Banco de dados NoSQL

## [CEFET MG](https://www.cefetmg.br/)

### Banco de Dados 2

#### Autores:

[**Erick Henrique**](https://github.com/ErickHDdS) <br>
[**Iagor de Souza**](https://github.com/IagorSs) <br>
[**Marina Diniz**](https://github.com/pixel-debug) <br>

#### Download dos dados

Os dados podem ser obtidos através deste [link](https://dados.pbh.gov.br/dataset/contagens-volumetricas-de-radares). Eles representam as contagens volumétricas dos radares instalados nas principais vias de Belo Horizonte, classificadas por tipo de veículo.

#### Pré-requisitos

Para executar, é necessário ter o [Node.js](https://nodejs.org/pt) v20 ou superior.

1. Copie a pasta contendo os dados de leituras dos radares de um dia específico para o diretório `src/sgbd/db`.
2. Altere o caminho do diretório no arquivo `src/sgbd/db/createDb.js` para o local onde a pasta de arquivos que deseja converter está localizada:

```javaScript
   const dir = "./20230806";
```

#### Geração da base

Para gerar os arquivos que serão usados na base de dados, siga o passo abaixo:

1. Execute os comandos:

```javaScript
   npm i
   npm run create-db
```

#### Executando as buscas

Para executar as buscas:

1. Execute o comando:

```javaScript
   node src/serviceExamples.js
```

Com esse comando, as seguintes buscas serão realizadas:

1. Total de infrações por tipo de veículo e por radar
2. Velocidade média aferida em cada radar
3. Os 5 primeiros radares que contém mais informações de leituras de veículos do tipo AUTOMÓVEL
4. Média de tamanho de veículos em cada radar
5. Média de tamanho dos veículos em todos os radares por classificação, exceto MOTOS
