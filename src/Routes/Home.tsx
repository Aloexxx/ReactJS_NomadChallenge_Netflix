import { useQuery } from "react-query";
import { getMoviesNowPlaying,getMoviesLatest, IGetMoviesResult, getMoviesTop, getMoviesUp } from "../api";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import {useNavigate,useMatch} from "react-router-dom";
import MovieNow from "../Components/MovieNow";
import MovieTop from "../Components/MovieTop";
import MovieUp from "../Components/MovieUp";
import MovieLatest from "../Components/MovieLatest";

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

function Home(){
    const history=useNavigate();
    const onOverlayClick=()=>history(`${process.env.PUBLIC_URL}/`);
    const {scrollY} =useViewportScroll();
    const bigMovieMatch = useMatch(`/movies/:category/:movieId`);
    const [more,setMore] = useState(false);
    const {data:dataNow,isLoading:loadingNow} = useQuery<IGetMoviesResult>(["movies","nowPlaying"],getMoviesNowPlaying)
    const {data:dataLatest,isLoading:loadingLatest} = useQuery<IGetMoviesResult>(["movies","latest"],getMoviesLatest)
    const {data:dataTop,isLoading:loadingTop} = useQuery<IGetMoviesResult>(["movies","top"],getMoviesTop)
    const {data:dataUp,isLoading:loadingUp} = useQuery<IGetMoviesResult>(["movies","up"],getMoviesUp)
    const [clickedMovie,setClickedMovie] = useState({backdrop_path:"",title:"",overview:"",poster_path:"",release_date:"",vote_average:0,vote_count:0,popularity:0});


    useEffect(()=>{
        if(bigMovieMatch?.params.category==="now"){
            setClickedMovie(bigMovieMatch?.params.movieId && dataNow?.results.find(movie=>String(movie.id)===bigMovieMatch.params.movieId)||{backdrop_path:"",title:"",overview:"",poster_path:"",release_date:"",vote_average:0,vote_count:0,popularity:0})
        }else if(bigMovieMatch?.params.category==="up"){
            setClickedMovie(bigMovieMatch?.params.movieId && dataUp?.results.find(movie=>String(movie.id)===bigMovieMatch.params.movieId)||{backdrop_path:"",title:"",overview:"",poster_path:"",release_date:"",vote_average:0,vote_count:0,popularity:0})
        }else if(bigMovieMatch?.params.category==="top"){
            setClickedMovie(bigMovieMatch?.params.movieId && dataTop?.results.find(movie=>String(movie.id)===bigMovieMatch.params.movieId)||{backdrop_path:"",title:"",overview:"",poster_path:"",release_date:"",vote_average:0,vote_count:0,popularity:0})
        }else{
            null
        }
    },[bigMovieMatch])

    return(
        <Wrapper>
            {loadingNow?(
                <Loader>Loading...</Loader>
            ):(
                <>
                    <Banner 
                        bgPhoto={makeImagePath(dataNow?.results[0].backdrop_path || "")}
                    >
                        <Title>{dataNow?.results[0].title}</Title>
                        <Overview>{dataNow?.results[0].overview}</Overview>
                    </Banner>
                    <MovieNow/>
                    {loadingTop?<p>Loading</p>:<MovieTop/>}
                    {loadingUp?<p>Loading</p>:<MovieUp/>}
                    {loadingLatest?<p>Loading</p>:<MovieLatest/>}
                    <AnimatePresence>
                        {bigMovieMatch?
                            <>
                                <Overlay onClick={onOverlayClick} exit={{opacity:0}} animate={{opacity:1}}/>
                                <BigMovie
                                    style={{top:scrollY.get()+50}}
                                    layoutId={bigMovieMatch.params.movieId}
                                >
                                    {clickedMovie?
                                        <>
                                            <BigCover style={{backgroundImage:`url(${makeImagePath(clickedMovie.poster_path,"w500")})`}}/>
                                            <BigTitle>{clickedMovie.title}</BigTitle>
                                            <BigOverView>
                                                {clickedMovie.overview.length>200?
                                                    <>
                                                        {more?clickedMovie.overview:clickedMovie.overview.substr(0,200)+"..."}
                                                        <button  style={{border:"none",borderRadius:3,margin:2,opacity:0.6,backgroundColor:"#cccccc"}} onClick={()=>setMore((prev)=>!prev)}>{more?"접기":"더보기"}</button>
                                                    </>
                                                :
                                                    clickedMovie.overview
                                                }
                                            </BigOverView>
                                            <div style={{padding:20}}>
                                                <p>Release: {clickedMovie.release_date}</p>
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

export default Home;