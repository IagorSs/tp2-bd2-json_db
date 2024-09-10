import db from "./sgbd/db/index.js";
import { get } from "./sgbd/index.js";

// Obter o id de todos equipamentos
const getAllEquipIds = async () => {
	const dbRes = await get("/");

	return Object.keys(dbRes);
};

// Consultar informações de um radar
const getInfoAboutRadar = async radarId => {
	return get(`/${radarId}`);
};

// Obter leituras de um radar
const getLeiturasOfRadar = async radarId => {
	return get(`/${radarId}/leituras`);
};

// Consulta 1: Total de infrações por tipo de veículo e por radar
const getTotalInfractios = async () => {
	const equipIds = await getAllEquipIds();

	const result = await Promise.all(
		equipIds.map(async id => {
			const radar = await getInfoAboutRadar(id);
			const leituras = await getLeiturasOfRadar(id);

			const infracoes = (leituras || []).filter(
				leitura => leitura.velocidade_aferida > radar.velocidade_permitida && leitura.velocidade_aferida <= 200
			);

			return {
				id_eqp: id,
				endereco: radar.endereco,
				classificacao: infracoes.map(infracao => infracao.classificacao),
				total_infracoes: infracoes.length,
			};
		})
	);

	return result;
};

// Consulta 2: Velocidade média aferida em cada radar
const getRadarAverageSpeed = async () => {
	const equipIds = await getAllEquipIds();

	const result = await Promise.all(
		equipIds.map(async id => {
			const radar = await getInfoAboutRadar(id);
			const leituras = await getLeiturasOfRadar(id);

			if (leituras.length === 0) return null; // Se não houver leituras, pula

			const totalVelocidade = leituras.reduce((acc, leitura) => acc + leitura.velocidade_aferida, 0);
			const velocidadeMedia = totalVelocidade / leituras.length;

			return {
				id_eqp: id,
				endereco: radar.endereco,
				velocidade_media: velocidadeMedia,
			};
		})
	);

	// Filtrar radars que não retornaram leituras
	return result.filter(r => r !== null);
};

// Consulta 3: Os 5 primeiros radares que contém mais informações de leituras de veículos do tipo AUTOMÓVEL
const getTopFiveVehiclesAUTOMOVEIS = async () => {
	const equipIds = await getAllEquipIds();

	const result = await Promise.all(
		equipIds.map(async id => {
			const radar = await getInfoAboutRadar(id);
			const leituras = await getLeiturasOfRadar(id);

			const automoveis = leituras.filter(leitura => leitura.classificacao === "AUTOMÓVEL");

			return {
				id_eqp: id,
				endereco: radar.endereco,
				total_veiculos: automoveis.length,
			};
		})
	);

	// Ordena por total de veículos e limita a 5
	return result.sort((a, b) => b.total_veiculos - a.total_veiculos).slice(0, 5);
};

// Consulta 4: Média de tamanho de veículos em cada radar
const getAverageSize = async () => {
	const equipIds = await getAllEquipIds();

	const result = await Promise.all(
		equipIds.map(async id => {
			const radar = await getInfoAboutRadar(id);
			const leituras = await getLeiturasOfRadar(id);

			const classificacaoMap = leituras.reduce((acc, leitura) => {
				if (!acc[leitura.classificacao]) {
					acc[leitura.classificacao] = { totalTamanho: 0, count: 0 };
				}
				acc[leitura.classificacao].totalTamanho += leitura.tamanho;
				acc[leitura.classificacao].count += 1;
				return acc;
			}, {});

			return Object.keys(classificacaoMap).map(classificacao => ({
				id_eqp: id,
				endereco: radar.endereco,
				classificacao,
				media_tamanho: classificacaoMap[classificacao].totalTamanho / classificacaoMap[classificacao].count,
			}));
		})
	);

	// Flatten array for easier access
	return result.flat();
};

// Consulta 5: Média de tamanho dos veículos em todos os radares por classificação, exceto MOTOS
const getAverageSizeWithoutMOTO = async () => {
	const equipIds = await getAllEquipIds();

	const classificacaoMap = {};

	await Promise.all(
		equipIds.map(async id => {
			const leituras = await getLeiturasOfRadar(id);

			leituras.forEach(leitura => {
				if (leitura.classificacao !== "MOTO") {
					if (!classificacaoMap[leitura.classificacao]) {
						classificacaoMap[leitura.classificacao] = { totalTamanho: 0, count: 0 };
					}
					classificacaoMap[leitura.classificacao].totalTamanho += leitura.tamanho;
					classificacaoMap[leitura.classificacao].count += 1;
				}
			});
		})
	);

	// Transformar o mapa de classificações em array
	return Object.keys(classificacaoMap).map(classificacao => ({
		classificacao,
		media_tamanho: classificacaoMap[classificacao].totalTamanho / classificacaoMap[classificacao].count,
	}));
};

// Função auxiliar para medir o tempo de execução
const measureExecutionTime = async (fn, fnName) => {
	console.time(fnName); // Inicia o timer
	const result = await fn(); // Executa a função
	console.timeEnd(fnName); // Finaliza o timer
	console.log(`${fnName} result:`, result); // Imprime o resultado
	return result;
};

// Função principal para executar e medir tempo de todas funções
const executeAndMeasure = async () => {
	await measureExecutionTime(getTotalInfractios, "getTotalInfractios");
	await measureExecutionTime(getRadarAverageSpeed, "getRadarAverageSpeed");
	await measureExecutionTime(getTopFiveVehiclesAUTOMOVEIS, "getTopFiveVehiclesAUTOMOVEIS");
	await measureExecutionTime(getAverageSize, "getAverageSize");
	await measureExecutionTime(getAverageSizeWithoutMOTO, "getAverageSizeWithoutMOTO");
};

// Executa tudo
await executeAndMeasure();
