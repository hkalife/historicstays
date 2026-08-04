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
  stayDetail: {
    notFound: 'Estadia não encontrada.',
    loadError: 'Algo deu errado ao carregar essa estadia. Tente novamente.',
    gallery: {
      previous: 'Foto anterior',
      next: 'Próxima foto',
      goToPhoto: (n: number) => `Ir para foto ${n}`,
    },
    amenitiesTitle: 'Comodidades',
    aboutTitle: 'Sobre essa estadia',
    historicNoteLabel: 'Nota histórica',
    guestsSuffix: (count: number) => `até ${count} ${count === 1 ? 'hóspede' : 'hóspedes'}`,
    booking: {
      checkInLabel: 'Check-in',
      checkOutLabel: 'Check-out',
      guestsLabel: 'Hóspedes',
      selectDates: 'Selecionar datas',
      nightsLabel: (count: number) => `${count} ${count === 1 ? 'noite' : 'noites'}`,
      totalLabel: 'Total',
      reserveButton: 'Reservar',
      perNight: '/ noite',
    },
    reviews: {
      title: 'Avaliações',
      basedOn: (count: number) => `Baseado em ${count} ${count === 1 ? 'avaliação' : 'avaliações'}`,
      noReviews: 'Ainda não há avaliações. Seja o primeiro a compartilhar sua experiência.',
      writeReviewTitle: 'Escreva uma avaliação',
      nameLabel: 'Seu nome',
      namePlaceholder: 'Maria Silva',
      ratingLabel: 'Nota',
      commentLabel: 'Comentário',
      commentPlaceholder: 'Conte o que tornou sua estadia especial...',
      submitButton: 'Enviar avaliação',
      submitting: 'Enviando...',
      submitError: 'Não foi possível enviar sua avaliação. Tente novamente.',
      submitSuccess: 'Obrigado por compartilhar sua avaliação!',
    },
  },
};
