let log = loglevel.createPackageLogger('PlayerPage');

Template.playerPage.events({

  'click .js-player-join-game .js-action': function () {
    let username = $('.js-player-join-game .js-username').val();
    let playerId = this._id;

    Accounts.createUser({
      username,
      password: 'bleepbloopbleep',
      createdAt: Date.now()
    }, onCreateUser);

    function onCreateUser(err) {
      if (err) {
        log.error('cannot create user', err);
        return;
      }

      log.info('user created', username);

      Meteor.loginWithPassword(username, 'bleepbloopbleep', onLoginUser);
    }

    function onLoginUser(err) {
      if (err) {
        log.error('cannot login user', err);
        return;
      }

      Players.update(playerId, {
        $set: { userId: Meteor.userId() }
      });
    }
  },

  'click .js-play-card': function (e) {
    e.preventDefault();

    let player = Template.parentData();

    Players.update(player._id, { $pull: { cards: this } });
    Games.update(player.game()._id, { $push: { open: this } });
  },

});
