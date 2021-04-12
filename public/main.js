fetch('http://localhost:5000/poll', {
  method: 'post',
  body: JSON.stringify({
    test: 123
  }),
  headers: new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
