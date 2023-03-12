import OmeggaPlugin, { OL, PS, PC, Vector } from 'omegga';
import fs from 'fs';
import path from 'path';
import { OmeggaPlayer, Brick } from './omegga';

type Config = { decimalplaces: number; prefix:string; suffix:string; startingamount: number; admins:string[], enablewhitelist: boolean, whitelist: string[]};
type Storage = { [id: string]: any};

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: PC<Config>;
  store: PS<Storage>;

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
    //Heal commands
    this.omegga.on('cmd:heal', (speaker: string, who:string,amount:string) => {
      let isadmin = false;
      for(let admin in this.config.admins){
        if(this.config.admins[admin]===speaker){
          isadmin = true;
          break;
        }
      }

      if(!isadmin){
        this.omegga.whisper(speaker,"You do not have permission to use this command");
        return;
      }
      if(who==="@a"){
        for(let player in this.omegga.getPlayers()){
          this.omegga.getPlayer(this.omegga.getPlayers()[player].name).damage(Number.parseInt(amount));
        }
      }else{
        let a = Number.parseInt(amount);
        let b = who;
        if(a === undefined)
        a=25;
        if(b===undefined)
        who=speaker;
      this.omegga.getPlayer(b).heal(a);
      }
    });
    //Hurt commands
    this.omegga.on('cmd:hurt', (speaker: string, who:string,amount:string) => {
      let isadmin = false;
      for(let admin in this.config.admins){
        if(this.config.admins[admin]===speaker){
          isadmin = true;
          break;
        }
      }

      if(!isadmin){
        this.omegga.whisper(speaker,"You do not have permission to use this command");
        return;
      }
      if(who==="@a"){
        for(let player in this.omegga.getPlayers()){
          this.omegga.getPlayer(this.omegga.getPlayers()[player].name).damage(Number.parseInt(amount));
        }
      }else{
        let a = Number.parseInt(amount);
        let b = who;
        if(a === undefined)
        a=25;
        if(b===undefined)
      this.omegga.getPlayer(b).damage(a);
      }
    });

    //Kill commands
    this.omegga.on('cmd:kill', (speaker: string, who: string) => {
      let isadmin = false;
      for(let admin in this.config.admins){
        if(this.config.admins[admin]===speaker){
          isadmin = true;
          break;
        }
      }

      if(!isadmin){
        this.omegga.whisper(speaker,"You do not have permission to use this command");
        return;
      }
      if(who === undefined){
        this.omegga.whisper(speaker,"Usage: /kill {player}");
        return;
      }
      if(who==="@a"){
        for(let player in this.omegga.getPlayers()){
          this.omegga.getPlayer(player).kill();
        }
      }else{
        let a = who;
        if(a === undefined)
        a = speaker;
      this.omegga.getPlayer(a).kill();
      }
    });

    //middleprint commands
    this.omegga.on('cmd:middleprint', (speaker: string,...args:string[]) => {
      let isadmin = false;
      for(let admin in this.config.admins){
        if(this.config.admins[admin]===speaker){
          isadmin = true;
          break;
        }
      }

      if(!isadmin){
        this.omegga.whisper(speaker,"You do not have permission to use this command");
        return;
      }
      args.reverse();
      let who = args.pop();
      args.reverse();

      if(who==="@a"){
        for(let player in this.omegga.getPlayers()){
          this.omegga.middlePrint(this.omegga.getPlayers()[player].name,sanitize(args));
        }
      }else{
        this.omegga.middlePrint(who,sanitize(args));
      }
    });
    //whisper commands
    this.omegga.on('cmd:whisper', (speaker: string, ...args:string[]) => {
      let isadmin = false;
      for(let admin in this.config.admins){
        if(this.config.admins[admin]===speaker){
          isadmin = true;
          break;
        }
      }

      if(!isadmin){
        this.omegga.whisper(speaker,"You do not have permission to use this command");
        return;
      }
      args.reverse();
      let who = args.pop();
      args.reverse();
      this.omegga.whisper(who,sanitize(args));
    });
    //chat commands
    this.omegga.on('cmd:chat', (speaker: string, ...args:string[]) => {
      let isadmin = false;
      for(let admin in this.config.admins){
        if(this.config.admins[admin]===speaker){
          isadmin = true;
          break;
        }
      }

      if(!isadmin){
        this.omegga.whisper(speaker,"You do not have permission to use this command");
        return;
      }
      this.omegga.broadcast(sanitize(args));
    });

    //Position commands
    this.omegga.on('cmd:getpos', async (speaker: string) => {
      let position = await this.omegga.getPlayer(speaker).getPosition();
      this.omegga.whisper(speaker,"Your position is <color=\"FF0000\">X="+position[0]+"</>, "+"<color=\"00A0FF\">Y="+position[1]+"</>, "+"<color=\"FFFF00\">Z="+position[2]+"</>"+".");
    });
    
    //Admin Commands ==============================================================

    this.omegga.on('interact',async ({message,player}) =>{
      if(message.startsWith('/tp ')){
        let messagearray = message.split(" ");
        this.omegga.writeln("Chat.Command /TP "+player.name+" "+messagearray[1]+" "+messagearray[2]+" "+messagearray[3]+" 1");
      }else if(message.startsWith('/tprel ')){
        let messagearray = message.split(" ");
        let playerpos = await this.omegga.getPlayer(player.name).getPosition();
        let x = Number.parseInt(messagearray[1])+playerpos[0];
        let y = Number.parseInt(messagearray[2])+playerpos[1];
        let z = Number.parseInt(messagearray[3])+playerpos[2];
        this.omegga.writeln("Chat.Command /TP "+player.name+" "+x+" "+y+" "+z+" 1");
      }else{
        
      }
    });



    this.omegga.on('join',async (player: OmeggaPlayer) =>{

      if(this.config.enablewhitelist){
        if(!player.isHost){
        let allowed = false;
        for(let a in this.config.whitelist){
          if(player.name === this.config.whitelist[a]){
            allowed = true;
            break;
          }
        }
        if(!allowed){
          this.omegga.writeln("Chat.Command /kick \""+player.name+"\" \"You are not whitelisted.\"");
          this.omegga.broadcast("Player "+player.name+" attempted to join, but was not whitelisted.");
          return;
        }
      }

      let jointext = fs.readFileSync(path.join(__dirname,"../jointext.txt"));
      let jointextarray = jointext.toLocaleString().split("/\r?\n/");
      for(let s in jointextarray){
        this.omegga.whisper(player.name,jointextarray[s]); 
      }
    }
    });



    return { registeredCommands: ['hurt','kill','middleprint','whisper','chat','bal','pay','givemoney','setmoney','heal','getpos'] };
  }
  async stop() {
  }
}

function sanitize(args: string[]){
  let s: string = "";
  for(let a in args){
    s+=args[a]+" ";
  }
  s=s.trim();
  return s;
}

