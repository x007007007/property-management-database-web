
const routes = [
  {
    path: '/',
    component: () => import('layouts/LocationLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
    ]
  },
  {
    path: '/hub',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':code/update', component: () => import('pages/HubPhoto.vue') }
    ]
  },
  {
    path: '/print',
    component: () => import('layouts/PrintLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PrintQRCode.vue') },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
