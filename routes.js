// Base middleware
var base = [];

// App routes
exports.routes = [
{
  path: '/',
  route: 'dashboard-index'
},
{
  path: '/meals/update',
  route: 'meals-update',
  method: 'post'
},
{
  path: '/meals/update/:name',
  route: 'meals-update-client'
}
];
