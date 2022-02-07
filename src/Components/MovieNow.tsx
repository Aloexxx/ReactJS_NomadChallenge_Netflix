import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { getMoviesNowPlaying, IGetMoviesResult } from "../api";

const Slider = styled.div`
    position:relative;
    top:-100px;
`;

const Row = styled(motion.div)`
    display:grid;
    gap:5px;
    grid-template-columns:repeat(6,1fr);
    position:absolute;
    width:100%;
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

const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color:white;
    background-image:url(${(props)=>props.bgPhoto});
    background-size:cover;
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
const offset=6

const MovieNow = ()=>{
    const history=useNavigate();
    const [index,setIndex] = useState(0);
    const [leaving,setLeaving] = useState(false);
    const {data:dataNow,isLoading:loadingNow} = useQuery<IGetMoviesResult>(["movies","nowPlaying"],getMoviesNowPlaying)
    const increaseIndex=()=>{
        if(dataNow){
            if(leaving) return;
            setLeaving(true);
            const totalMovies = dataNow?.results.length;
            const maxIndex = Math.ceil(totalMovies/offset)-1;
            setIndex((prev)=>prev===maxIndex?0:prev+1);
        }
    }
    const toggleLeaving = ()=>setLeaving((prev)=>!prev)
    const onBoxClicked = (movieId:number)=>{
        history(`${process.env.PUBLIC_URL}/movies/${"now"}/${movieId}`);
    }
    return(
        <Slider>
            <h1 style={{fontSize:25,margin:10}}>NowPlaying</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row 
                    variants={rowVariants} 
                    initial="hidden"  
                    animate="visible" 
                    exit="exit" 
                    transition={{type:"tween",duration:1}}
                    key={index}
                >
                    {dataNow?.results.slice(1).slice(offset*index,offset*index+offset).map((movie)=>
                        <Box 
                            layoutId={movie.id+""}
                            variants={BoxVariants}
                            key={movie.id}
                            whileHover="hover"
                            initial="normal"
                            transition={{type:"tween"}}
                            onClick={()=>onBoxClicked(movie.id)}
                            bgPhoto = {makeImagePath(movie.poster_path,"w500")}
                        >
                            <Info variants={infoVariants}>
                                <h4>{movie.title}</h4>
                            </Info>
                        </Box>
                    )}
                </Row>
            </AnimatePresence>
            <NextBtn onClick={increaseIndex}>▶</NextBtn>
        </Slider>
    )
}

export default MovieNow;