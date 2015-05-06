let log = loglevel.createPackageLogger('PlayerNew');

Template.playerJoin.helpers({

  isCurrentUser: function (user) {
    return user._id === Meteor.userId();
  },

  playerPageData: function () {
    return {
      _tableId: this.game().table()._id,
      _gameId: this.game()._id,
      _playerId: this._id,
    };
  },

  currentUserCanJoinGame: function (gameId) {
    let userId = Meteor.userId();
    return userId && !Players.findOne({ userId, gameId });
  },

});

Template.playerJoin.events({

  'click .js-user-create .js-action': function (e, template) {
    e.preventDefault();

    let username = template.$('.js-username').val();

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
      }
    }
  },

  'click .js-player-join-game': function (e) {
    e.preventDefault();

    let userId = Meteor.userId();
    let gameId = this._id;

    let playerId = Players.insert({ userId, gameId, });

    Stacks.insert({
      gameId,
      title: Meteor.user().username,
      playerId,
      size: 0,
      table: false,
      open: true,
      face: true,
      arrangeable: true,
      poppable: true,
      pushable: true,
      cards: [],
    });
  },

  'click .js-player-take-seat': function (e) {
    e.preventDefault();

    let userId = Meteor.userId();
    let playerId = this._id;
    let gameId = this.game()._id;

    Players.update(playerId, { $set: { userId } });
    Stacks.update({ gameId, playerId }, { $set: { title: this.user.username() }});
  },

});
