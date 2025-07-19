const express = require('express')
const morgan = require('morgan')
const { v4: uuid} = require('uuid')
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('common'));


// Agentes

var nextId = 1;
app.get("/agentes", (req,res) =>{
    res.status(200).json(agentes);
})


app.post("/agentes", (req,res)=>{

    const {nome, cargo} = req.body;
    if(!nome || !cargo){
        return res.status(400).json({
            status: 400,
            message: "dados incompletos"
        })
    }
    const novoAgente ={
        id : nextId++,
         nome,
        dataDeIncorporacao: new Date(),
        cargo
    }
    agentes.push(novoAgente);
    res.status(201).json(novoAgente)

})

app.get('/agentes/:id', (req,res)=>{
    const agentId = parseInt(req.params.id);
    const agent = agentes.find(a => a.id === agentId);
    
    if(!agent){
       return res.status(404).send("Agente nao encontrado");
    }
     res.status(200).json(agent);
})


app.delete('/agentes/:id', (req,res)=>{
    const agentId = parseInt(req.params.id);
    const agentIndex = agentes.findIndex(a => a.id === agentId);
    
    if(!agentIndex){
       return res.status(404).send("Agente nao encontrado");
    }
    agentes.splice(agentIndex, 1)
     res.status(204).send();
})


// Casos
const casos = [];
var nextId = 1;
app.get("/casos", (req,res) =>{
    res.status(200).json(casos);
})


app.post("/casos", (req,res)=>{

    const {titulo, descricao, status} = req.body;
    if(!titulo || !descricao || !status){
        return res.status(400).json({
            status: 400,
            message: "dados incompletos"
        })
    }
    // if(status != 'aberto' || status != 'solucionado'){
    //        return res.status(400).json({
    //         status: 400,
    //         message: "status nao permitido"
    //     })
    // }
    const novoCaso= {
         titulo,
        descricao,
        status
    }
    casos.push(novoCaso);
    res.status(201).json(novoCaso)

})

app.get('/casos/:id', (req,res)=>{
    const casoId = parseInt(req.params.id);
    const caso = casos.find(c => c.id === casoId);
    
    if(!caso){
       return res.status(404).send("Caso nao encontrado");
    }
     res.status(200).json(caso);
})


app.delete('/agentes/:id', (req,res)=>{
    const casoId = parseInt(req.params.id);
    const casoIndex = casos.findIndex(c => c.id === casoId);
    
    if(!casoIndex){
       return res.status(404).send("Agente nao encontrado");
    }
    casos.splice(casoIndex, 1)
     res.status(204).send();
})


app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});