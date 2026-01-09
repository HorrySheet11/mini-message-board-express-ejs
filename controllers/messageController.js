const 

async function getMessages(req, res) {
  const messages = await Message.find();
  res.render("index", { messages });
}