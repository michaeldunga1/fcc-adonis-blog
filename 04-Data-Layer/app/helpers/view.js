const path = require('path');
const { Edge } = require('edge.js');

const edge = new Edge({ cache: false });
edge.mount(path.join(__dirname, '../../resources/views'));

function viewLocals(req, extra = {}) {
  const user = req.user || null;
  const flash = req.session?.flash;
  if (req.session) req.session.flash = undefined;
  return {
    user,
    flash,
    canCreate: !!user,
    resetLink: true,
    detail: true,
    q: '',
    ...extra,
  };
}

async function renderView(res, req, name, data = {}) {
  const html = await edge.render(name, viewLocals(req, data));
  return res.send(html);
}

module.exports = { renderView, viewLocals };
