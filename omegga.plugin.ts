import OmeggaPlugin, { OL, PS, PC, Vector } from 'omegga';
import fs from 'fs';
import path from 'path';
import { OmeggaPlayer, Brick } from './omegga';

type Config = { decimalplaces: number; prefix:string; suffix:string; startingamount: number; admins:string[], enablewhitelist: boolean, whitelist: string[]};
type Storage = { [id: string]: any};

let economy = [];

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
    this.omegga.on('cmd:heal', (speaker: string) => {
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
      this.omegga.getPlayer(speaker).heal(2500);
    });
    this.omegga.on('cmd:heal', (speaker: string, who: string) => {
      if(who===undefined)
        return;
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
          this.omegga.getPlayer(this.omegga.getPlayers()[player].name).damage(25);
        }
      }else{
      this.omegga.getPlayer(who).heal(2500);
      }
    });
    this.omegga.on('cmd:heal', (speaker: string, who:string,amount:string) => {
      if(who===undefined||amount ===undefined)
        return;
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
      this.omegga.getPlayer(who).heal(Number.parseInt(amount));
      }
    });
    //Hurt commands
    this.omegga.on('cmd:hurt', (speaker: string) => {
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
      this.omegga.getPlayer(speaker).damage(25);
    });
    this.omegga.on('cmd:hurt', (speaker: string, who: string) => {
      if(who===undefined)
        return;
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
          this.omegga.getPlayer(this.omegga.getPlayers()[player].name).damage(25);
        }
      }else{
      this.omegga.getPlayer(who).damage(25);
      }
    });
    this.omegga.on('cmd:hurt', (speaker: string, who:string,amount:string) => {
      if(who===undefined||amount ===undefined)
        return;
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
      this.omegga.getPlayer(who).damage(Number.parseInt(amount));
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
      this.omegga.getPlayer(who).kill();
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
    
    //Money commands
    this.omegga.on('cmd:bal', (speaker: string, who: string) => {
      if(who===undefined){
        let a = economy[speaker];
        if(a === undefined)
          a=0;
        this.omegga.whisper(speaker,"You have <color=\"ffff00\">"+this.config.prefix+a+this.config.suffix+"</>.");
        return;
      }
      let a = economy[who];
      if(a === undefined)
        a=0;
      this.omegga.whisper(speaker,who+" has <color=\"ffff00\">"+this.config.prefix+a+this.config.suffix+"</>.");
    });

    this.omegga.on('cmd:pay', (speaker: string, who:string,amount:string) => {
      if(who===undefined||amount===undefined){
        this.omegga.whisper(speaker,"Usage: /pay {player} {amount}");
        return;
      }
      let num = Number.parseInt(amount);
      num = Number.parseInt(num.toFixed(this.config.decimalplaces));
      if(num <= 0){
        this.omegga.whisper(speaker, "You cannot pay non-real amounts.");
        return;
      }
      if(economy[speaker] < num){
        this.omegga.whisper(speaker, "You do not have enough to pay "+who+".");
        return;
      }
      economy[speaker]=economy[speaker]-num;
      economy[who]=economy[who]-num;

      this.omegga.whisper(speaker,"You have given <color=\"ffff00\">"+this.config.prefix+num+this.config.suffix+"</> to "+who+".");
      this.omegga.whisper(speaker,"You have recieved <color=\"ffff00\">"+this.config.prefix+num+this.config.suffix+"</> from "+speaker+".");
    });
    
    //Admin Commands ==============================================================
    
    
    this.omegga.on('cmd:givemoney', (speaker: string, who:string,amount:string) => {
      if(who===undefined||amount===undefined){
        this.omegga.whisper(speaker,"Usage: /givemoney {player} {amount}");
        return;
    }
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
      let num = Number.parseInt(amount);
      num = Number.parseInt(num.toFixed(this.config.decimalplaces));
      economy[who]=economy[who]+num;
      this.omegga.whisper(speaker,"You admin-gave <color=\"ffff00\">"+this.config.prefix+num+this.config.suffix+"</> to "+who+".");
    });
    
    
    this.omegga.on('cmd:setmoney', (speaker: string, who:string,amount:string) => {
      if(who===undefined||amount===undefined){
        this.omegga.whisper(speaker,"Usage: /setmoney {player} {amount}");
        return;
      }
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
      let num = Number.parseInt(amount);
      num = Number.parseInt(num.toFixed(this.config.decimalplaces));
      economy[who]=num;
      this.omegga.whisper(speaker,"You admin-gave <color=\"ffff00\">"+this.config.prefix+num+this.config.suffix+"</> to "+who+".");
    });






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

      if(this.config.whitelist){
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





      if(!economy[player.name]){
        economy[player.name] = await this.store.get("econ."+player.name) ?? this.config.startingamount;
        console.log("Setting player bank to "+economy[player.name]+" for "+player.name+".");
      }
      let jointext = fs.readFileSync(path.join(__dirname,"../jointext.txt"));
      let jointextarray = jointext.toLocaleString().split("/\r?\n/");
      for(let s in jointextarray){
        this.omegga.whisper(player.name,jointextarray[s]);
      }
    });

    for(let playerindex in this.omegga.getPlayers()){
      let player = this.omegga.getPlayers()[playerindex];
      if(!economy[player.name]){
        economy[player.name] = await this.store.get("econ."+player.name) ?? this.config.startingamount;
        console.log("Setting player bank to "+economy[player.name]+" for "+player.name+".");
      }
    }



    return { registeredCommands: ['hurt','kill','middleprint','whisper','chat','bal','pay','givemoney','setmoney','heal','getpos'] };
  }
  async stop() {
    console.log("Saving economy...");
    for(let a in economy){
      this.store.set("econ."+a,economy[a]);
    }
  }

  async pluginEvent(event: string, from: string, ...args: any[]): Promise<unknown> {
      if(event === "withdraw"){
        if(!economy[args[0]]){
          economy[args[0]] = await this.store.get("econ."+args[0]) ?? this.config.startingamount;
          console.log("Setting player bank to "+economy[args[0]]+" for "+args[0]+".");
        }
        economy[args[0]]-=args[1];
        console.log("withdrawing "+args[1]+" from "+args[0]);
        return economy[args[0]];
      }else if(event === "deposit"){
        if(!economy[args[0]]){
          economy[args[0]] = await this.store.get("econ."+args[0]) ?? this.config.startingamount;
          console.log("Setting player bank to "+economy[args[0]]+" for "+args[0]+".");
        }
        economy[args[0]]+=args[1];
        console.log("depositing "+args[1]+" to "+args[0]);
        return economy[args[0]];
      }else if(event === "bank"){
        if(!economy[args[0]]){
          economy[args[0]] = await this.store.get("econ."+args[0]) ?? this.config.startingamount;
          console.log("Setting player bank to "+economy[args[0]]+" for "+args[0]+".");
        }
        return economy[args[0]];
      }
      return null;
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

