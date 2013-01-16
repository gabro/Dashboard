// Base middleware
var base = [];

// App routes
exports.routes = [
{
  path: '/',
  route: 'dashboard-index'
},
{
  path: '/eatings/update',
  route: 'eatings-update',
  method: 'post'
},
{
  path: '/eatings/update/:name',
  route: 'eatings-update-client'
}
];