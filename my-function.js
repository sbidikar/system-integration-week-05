exports.helloWorld = (req, res) => {
  let keyword = req.query.keyword;
  if(keyword){
    res.status(200).send('Siddharth Bidikar says ' +keyword);
  } else {
    res.status(200).send('Provide keyword in query parameter');
  }
};

