import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getTvAiring, getTvLatest, getTvPopular, getTvTop, IGetTvResult } from "../api";
import styled from "styled-components";
import { AnimatePresence,motion } from "framer-motion";
import { makeImagePath } from "../utils";
import { useNavigate } from "react-router";
const Slider = styled.div`
    position:relative;
    top:900px;
`;
const NextBtn = styled.button`
    position:absolute;
    width:50px;
    height:50px;
    font-size:30px;
    right:10px;
    top:80px;
    background-color:rgba(0,0,0,0);
    color:red;
    border:none;
`;
const Row = styled(motion.div)`
    display:grid;
    gap:5px;
    grid-template-columns:repeat(6,1fr);
    position:absolute;
    width:100%;
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color:white;
    background-size:cover;
    background-image:url(${(props)=>props.bgPhoto});
    background-position:center center;
    height:200px;
    color:red;
    font-size:64px;
    cursor:pointer;
    &:first-child{
        transform-origin:center left;
    }
    &:last-child{
        transform-origin:center right;
    }
`;
const Info = styled(motion.div)`
    padding:10px;
    background-color:${props=>props.theme.black.lighter};
    opacity:0;
    position:absolute;
    width:100%;
    bottom:0;
    h4{
        text-align:center;
        font-size:18px;
    }
`;
const rowVariants = {
    hidden:{
        x:window.outerWidth,
    },
    visible:{
        x:0,
    },
    exit:{
        x:-window.outerWidth
    },
}
const BoxVariants = {
    normal:{
        scale:1
    },
    hover:{
        scale:1.3,
        y:-10,
        transition:{
            delay:0.4,
            duration:0.3,
            type:"tween"
        }
    }
}
const infoVariants = {
    hover:{
        opacity:1,
        transition:{
            delay:0.4,
            duration:0.3,
            type:"tween"
        }
    }
}
const offset=6;
function TvLatest(){
    const history=useNavigate();
    const [index,setIndex] = useState(0);
    const [leaving,setLeaving] = useState(false);
    const {data:dataLatest,isLoading:loadingLatest} = useQuery(["tv","latest"],getTvLatest);
    useEffect(()=>{
        loadingLatest?null:console.log(dataLatest.id,"Latest");
    },[loadingLatest])
    const toggleLeaving = ()=>setLeaving((prev)=>!prev)
    const onBoxClicked = (tvId:number)=>{
        history(`/tv/${"popular"}/${tvId}`);
    }
    const increaseIndex=()=>{
        if(dataLatest){
            if(leaving) return;
            setLeaving(true);
            const totalMovies = dataLatest?.results.length;
            const maxIndex = Math.ceil(totalMovies/offset)-1;
            setIndex((prev)=>prev===maxIndex?0:prev+1);
        }
    }
    return(
        <>
        {loadingLatest?
            <p>Loading</p>
            :
        <Slider>
            <h1 style={{fontSize:25,margin:10}}>Latest</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                    variants={rowVariants} 
                    initial="hidden"  
                    animate="visible" 
                    exit="exit" 
                    transition={{type:"tween",duration:1}}
                    key={index}
                >
                    <Box 
                        layoutId={dataLatest.id+"latest"}
                        variants={BoxVariants}
                        key={dataLatest.id+"latest"}
                        whileHover="hover"
                        initial="normal"
                        transition={{type:"tween"}}
                        onClick={()=>onBoxClicked(dataLatest.id)}
                        bgPhoto = {makeImagePath(dataLatest.poster_path,"w500")}
                    >
                        <Info variants={infoVariants}>
                            <h4>{dataLatest.name}</h4>
                        </Info>
                    </Box>
                </Row>   
            </AnimatePresence>
            <NextBtn onClick={increaseIndex}>▶</NextBtn>
        </Slider>
        }
        </>
    )
}

export default TvLatest;