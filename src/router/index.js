import { createRouter, createWebHistory } from 'vue-router/auto'
import IndexPage from '../pages/index.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: (to) => ({ path: '/pokemon/1', query: to.query }),
    },
    {
      path: '/pokemon',
      redirect: (to) => ({ path: '/pokemon/1', query: to.query }),
    },
    {
      path: '/pokemon/:page(\\d+)',
      name: 'all-pokemon-page',
      component: IndexPage,
      props: true,
    },
    {
      path: '/mypokemon',
      redirect: (to) => ({ path: '/mypokemon/1', query: to.query }),
    },
    {
      path: '/mypokemon/:page(\\d+)',
      name: 'my-pokemon-page',
      component: IndexPage,
      props: true,
    },
  ],
});


router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Ricaricamento della pagina per risolvere errore di importazione dinamica')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Errore di importazione dinamica, il ricaricamento della pagina non ha risolto il problema', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
