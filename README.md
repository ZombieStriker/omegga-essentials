
# essentials

An essential plugin for [omegga](https://github.com/brickadia-community/omegga).

### Features:
- Whitelist
- Interactable Block Teleporters
- Economy System
- Hurting and Healing commands
- Whisper, Chat, or Middleprint messages

## Commands
| Commands | Usages |
|--------|----------|
| /hurt <player> <amount> | Deals damage to the player.|
| /heal <player> <amount> | Heals the player.|
| /bal | Shows you your current balance|
| /pay <player> <amount> | Transfers money from your account to the other player.|
| /middleprint <player> <message> | Middleprint a message to a player (Use @a to print to all players.)|
| /whisper <player> <message> | Whispers a message to a player (Use @a to whisper to all players.)|
| /chat <message> | Sends a message in chat to all|
| /getPos| Gets your current position|

## Interact Commands (put these in the console output for Interact Components)
|Command|Usage|
|--------|--------|
|/tp <x> <y> <z>| Teleports a player to a specific coordinate on interact|
|/tprel <x> <y> <z>| Teleports the player relative to the coordates on interact|

## Install

`omegga install gh:Zombie_Striker/essentials`

## For Developers
To interact with the economy, use the following bit of code:
```
    const econ = await this.omegga.getPlugin('essentials');
    if (!econ) {
      console.error(
        'The currency plugin is not installed, so this plugin will not work!'
      );
      return;
    }

    let balance1 = econ.emitPlugin('deposit',["Some_Player", amount]);
    let balance2 = econ.emitPlugin('withdraw',["Some_Player", amount]);
    let balance3 = econ.emitPlugin('bank',["Some_Player"]);
```