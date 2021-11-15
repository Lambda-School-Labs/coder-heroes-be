const express = require('express');
const authRequired = require('../middleware/authRequired');
const Newsfeed = require('./newsfeedModel');
const router = express.Router();

router.get('/', authRequired, function (req, res) {
  Newsfeed.getNewsfeed()
    .then((newsfeedList) => {
      res.status(200).json(newsfeedList);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  Newsfeed.findByNewsfeedId(id)
    .then((newsfeed) => {
      if (newsfeed) {
        res.status(200).json(newsfeed);
      } else {
        res.status(404).json({ error: 'Newsfeed Not Found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/', async (req, res) => {
  const newsfeed = req.body;
  if (newsfeed) {
    try {
      await Newsfeed.addNewsfeed(newsfeed).then((inserted) =>
        res
          .status(200)
          .json({ message: 'Newsfeed added.', newsfeed: inserted[0] })
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'Newsfeed details missing.' });
  }
});

router.put('/', authRequired, (req, res) => {
  const newsfeed = req.body;
  if (newsfeed) {
    const { id } = newsfeed;
    Newsfeed.findByNewsfeedId(id)
      .then(
        Newsfeed.updateNewsfeed(id, newsfeed)
          .then((updated) => {
            res.status(200).json({
              message: `Newsfeed with id: ${id} updated`,
              newsfeed: updated[0],
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update Newsfeed '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find Newsfeed '${id}'`,
          error: err.message,
        });
      });
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  try {
    Newsfeed.findByNewsfeedId(id).then((newsfeed) => {
      Newsfeed.removeNewsfeed(newsfeed[0].id).then(() => {
        res.status(200).json({
          message: `Newsfeed with id:'${id}' was deleted.`,
          newsfeed: newsfeed[0],
        });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete Newsfeed with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
