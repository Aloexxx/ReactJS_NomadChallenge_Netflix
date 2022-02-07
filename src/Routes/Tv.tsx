import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getTvAiring, getTvLatest, getTvPopular, getTvTop, IGetTvResult } from "../api";
import styled from "styled-components";
import { AnimatePresence,motion, useViewportScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import TvPopular from "../Components/TvPopular";
import { useMatch, useNavigate } from "react-router";
import TvTop from "../Components/TvTop";
import TvAiring from "../Components/TvAiring";
import TvLatest from "../Components/TvLatest";

const Wrapper = styled.div`
    background:black;
`;

const Loader = styled.div`
    height:20vh;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const Banner = styled.div<{bgPhoto:string}>`
    height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding:60px;
    background-image:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)), 
        url(${(props)=>props.bgPhoto});
    background-size:cover;
`;

const Title = styled.h2`
    font-size:68px;
    margin-bottom:20px;
`;

const Overview = styled.p`
    font-size:30px;
    width:50%;
`;

const Overlay = styled(motion.div)`
    position:fixed; //absolute로 할 시 overlay가 짤려서 나옴
    top:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,0.5);
    opacity:0;
`;

const BigMovie = styled(motion.div)`
    position:absolute;
    width:40vw;
    left:0;
    right:0;
    margin:0 auto;
    border-radius:15px;
    overflow:hidden;
    background-color:${(props)=>props.theme.black.lighter};
`;

const BigCover = styled.div`
    width:100%;
    height:400px;
    background-size:cover;
    background-position:center center;
`;

const BigTitle = styled.h3`
    color:${(props)=>props.theme.white.lighter};
    text-align:center;
    padding:10px;
    font-size:46px;
    position:relative;
`;
const BigOverView = styled.div`
    padding:20px;
    position:relative;
    color:${(props)=>props.theme.white.lighter};
`;

function Tv(){
    const history=useNavigate();
    const onOverlayClick=()=>history(`${process.env.PUBLIC_URL}/tv`);
    const {scrollY} =useViewportScroll();
    const bigTvMatch = useMatch(`${process.env.PUBLIC_URL}/tv/:category/:tvId`);
    const [more,setMore] = useState(false);
    const {data:dataLatest,isLoading:loadingLatest} = useQuery(["tv","latest"],getTvLatest);
    const {data:dataTop,isLoading:loadingTop} = useQuery<IGetTvResult>(["tv","top"],getTvTop);
    const {data:dataAiring,isLoading:loadingAiring} = useQuery<IGetTvResult>(["tv","airing"],getTvAiring);
    const {data:dataPopular,isLoading:loadingPopular} = useQuery<IGetTvResult>(["tv","popular"],getTvPopular);
    const [clickedMovie,setClickedMovie] = useState({backdrop_path:"",name:"",overview:"",first_air_date:"",poster_path:"",vote_average:0,vote_count:0,popularity:0});
    useEffect(()=>{
        if(bigTvMatch?.params.category==="popular"){
            setClickedMovie(bigTvMatch?.params.tvId && dataPopular?.results.find(movie=>String(movie.id)===bigTvMatch.params.tvId)||{backdrop_path:"",name:"",overview:"",first_air_date:"",poster_path:"",vote_average:0,vote_count:0,popularity:0})
        }else if(bigTvMatch?.params.category==="airing"){
            setClickedMovie(bigTvMatch?.params.tvId && dataAiring?.results.find(movie=>String(movie.id)===bigTvMatch.params.tvId)||{backdrop_path:"",name:"",overview:"",first_air_date:"",poster_path:"",vote_average:0,vote_count:0,popularity:0})
        }else if(bigTvMatch?.params.category==="top"){
            setClickedMovie(bigTvMatch?.params.tvId && dataTop?.results.find(movie=>String(movie.id)===bigTvMatch.params.tvId)||{backdrop_path:"",name:"",overview:"",first_air_date:"",poster_path:"",vote_average:0,vote_count:0,popularity:0})
        }else{
            null
        }
    },[bigTvMatch])
    return(
        <Wrapper>
        {loadingPopular?(
            <Loader>Loading...</Loader>
        ):(
            <>
                <TvLatest/>
                <TvPopular/>
                {loadingTop?<p>Loading</p>:<TvTop/>}
                {loadingAiring?<p>Loading</p>:<TvAiring/>}
                <AnimatePresence>
                    {bigTvMatch?
                        <>
                            <Overlay onClick={onOverlayClick} exit={{opacity:0}} animate={{opacity:1}}/>
                            <BigMovie
                                style={{top:scrollY.get()+50}}
                                layoutId={bigTvMatch.params.tvId+`${bigTvMatch?.params.category}`}
                            >
                                {clickedMovie?
                                    <>
                                        <BigCover style={{backgroundImage:`url(${makeImagePath(clickedMovie.poster_path,"w500")})`}}/>
                                        <BigTitle>{clickedMovie.name}</BigTitle>
                                        <BigOverView>
                                            {clickedMovie.overview.length>200?
                                                <>
                                                    {more?clickedMovie.overview:clickedMovie.overview.substr(0,200)+"..."}
                                                    <button style={{border:"none",borderRadius:3,margin:2,opacity:0.6,backgroundColor:"#cccccc"}} onClick={()=>setMore((prev)=>!prev)}>{more?"접기":"더보기"}</button>
                                                </>
                                            :
                                                clickedMovie.overview
                                            }
                                        </BigOverView>
                                        <div style={{padding:20}}>
                                            <p>FirstAir: {clickedMovie.first_air_date}</p>
                                            <p>Popularity: {clickedMovie.popularity}</p>
                                            <p>VoteAverage⭐: {clickedMovie.vote_average}</p>
                                            <p>VoteCount: {clickedMovie.vote_count}</p>
                                        </div>
                                    </>
                                    :null
                                }
                            </BigMovie>
                        </>
                    :
                        null
                    }
                </AnimatePresence>
            </>
        )}
    </Wrapper>
    )
}

export default Tv;