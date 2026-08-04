import type { en } from './en';

export const pt: typeof en = {
  header: {
    selectLanguage: 'Selecionar idioma',
  },
  footer: {
    craftedBy: 'Criado por',
    viewOnGithub: 'Ver no GitHub',
  },
  home: {
    hero: {
      title: 'Encontre sua próxima estadia entre paredes com história',
      subtitle: 'Hospedagens únicas dentro de construções históricas pela Europa.',
    },
    search: {
      destinationLabel: 'Destino',
      destinationPlaceholder: 'Ex: Praga, Amsterdã...',
      clearDestination: 'Limpar destino',
      datesLabel: 'Datas',
      datesPlaceholder: 'Selecionar datas',
      guestsLabel: 'Hóspedes',
      guestsCount: (count: number) => `${count} ${count === 1 ? 'hóspede' : 'hóspedes'}`,
      decreaseGuests: 'Diminuir número de hóspedes',
      increaseGuests: 'Aumentar número de hóspedes',
      searchButton: 'Pesquisar',
    },
    results: {
      title: 'Estadias disponíveis',
      perNight: '/ noite',
      empty: 'Nenhuma estadia encontrada para essa busca. Tente outras datas ou filtros.',
      error: 'Algo deu errado ao carregar as estadias. Tente novamente.',
    },
  },
};
