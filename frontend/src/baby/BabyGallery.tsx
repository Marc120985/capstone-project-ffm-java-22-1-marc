import React, {useEffect, useState} from 'react';
import {BabyModel} from "./BabyModel";
import {useParams} from "react-router";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {GalleryPictureModel} from "./GalleryPictureModel";
import axios from "axios";

type babyProps = {
    babies: BabyModel[],
    getAllBabies: () => void
}

export default function BabyGallery(props: babyProps) {

    const fileStartUrl = "/api/pictures/files/";
    const params = useParams()
    const id = params.id;
    const [isUpload, setIsUpload] = useState(false);
    const [file, setFile] = useState<FileList | null>(null)
    const searchBaby = props.babies.find(element => element.id === id)
    const [messageStatus, setMessageStatus] = useState("");
    const [error, setError] = useState("");
    const [baby, setBaby] = useState<BabyModel>({
        id: "",
        name: "",
        birthday: "",
        weight: "",
        height: "",
        gender: "",
        profilePicture: {name: "baby_placeholder.jpeg", url: "/api/pictures/files/baby_placeholder.jpeg",},
        pictureGallery: []
    });
    let fileData = new FormData();
    const [pictureOpen, setPictureOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    fileData.append("file", file ? file[0] : new File([""], "baby_placeholder.jpeg"));

    useEffect(() => {
        setBaby(searchBaby ? searchBaby : {
            id: "",
            name: "",
            birthday: "",
            weight: "",
            height: "",
            gender: "",
            profilePicture: {name: "baby_placeholder.jpeg", url: "/api/pictures/files/baby_placeholder.jpeg"},
            pictureGallery: []
        })
    }, [searchBaby])

    let fileName = "";

    function uploadBabyPic() {
        axios.post("/api/pictures/upload/", fileData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => response)
            .then((response) => {
                if (response.request.response) {
                    fileName = response.request.response;
                }
                if (response.status === 200) {
                    setMessageStatus("Bild erfolgreich hochgeladen");
                    (setTimeout(() => {
                        setMessageStatus("")
                    }, 2000));
                    (setTimeout(() => setIsUpload(false), 2000));
                    (setTimeout(() => updateBabyGo(fileName), 2000));
                }
            })
            .catch((error) => {
                if (error.response.status === 417) {
                    setError("Fehler beim hochladen, bitte versuche es erneut");
                    (setTimeout(() => setError(""), 5000));
                }
                console.log("Error =>" + error)
            })
    }

    const updateBabyGo = (fileName: string) => {
        let fileUrl = fileStartUrl.concat(fileName ? fileName : "baby_placeholder.jpeg")
        axios.put("/api/babies/picturegallery/" + id, {name: fileName, url: fileUrl})
            .then(props.getAllBabies)
            .catch(error => console.log("Edit Error: " + error))
    }

    const [pic, setPic] = useState("")
    const [picName, setPicName] = useState("")
    const handleOpenPicture = (picture: GalleryPictureModel) => {
        setPic(picture.url)
        setPicName(picture.name)
        setPictureOpen(true);
        console.log(pic)

    };

    function deletePicture() {
        axios.delete("/api/babies/picturegallery/" + id, {
            data: {
                name: picName,
                url: pic
            }
        })
            .then((response) => response)
            .then((response) => {
                if (response.status === 200) {
                    setMessageStatus("Bild erfolgreich gelöscht");
                    (setTimeout(() => {
                        setMessageStatus("")
                    }, 2000));
                    (setTimeout(() => {
                        props.getAllBabies()
                    }, 2000));
                    (setTimeout(() => setPictureOpen(false), 2000));
                    (setTimeout(() => setIsDelete(false), 20));
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    setError("Fehler beim löschen, bitte versuche es erneut");
                    (setTimeout(() => setError(""), 3000));
                }
                console.log("Error =>" + error)
            })
    }

    return <>
        {isUpload && (
            <StyledDiv>
                <StyledDiv2>
                    <StyledP2>Wähle ein neues Bild für dein Fotoalbum von {baby.name} aus.</StyledP2>
                    <input type={"file"} accept={"image/*"} onChange={(e) => setFile(e.target.files)}/>
                    <StyledDiv3>
                        <StyledButton1 onClick={() => setIsUpload(false)}>Abbrechen</StyledButton1>
                        <StyledButton3 onClick={uploadBabyPic}>Hochladen</StyledButton3>
                    </StyledDiv3>
                    {messageStatus && <StyledP2>{messageStatus}</StyledP2>}
                    {error && <StyledP2>{error}</StyledP2>}
                </StyledDiv2>
            </StyledDiv>
        )}
        {pictureOpen && (
            <StyledDiv>
                <StyledDiv2>
                    <StyledP2>Bild bearbeiten:</StyledP2>
                    <StyledImg3 src={pic} alt={"Bild"}/>
                    <StyledDiv3>
                        <StyledButton1 onClick={() => setPictureOpen(false)}>Abbrechen</StyledButton1>
                        <StyledButton3 onClick={() => setIsDelete(true)}>Löschen</StyledButton3>
                    </StyledDiv3>
                    {messageStatus && <StyledP2>{messageStatus}</StyledP2>}
                </StyledDiv2>
            </StyledDiv>
        )}
        {isDelete && (
            <StyledDiv>
                <StyledDiv2>
                    <StyledP2>Möchtest du das Bild löschen?</StyledP2>
                    <StyledDiv3>
                        <StyledButton1 onClick={() => setIsDelete(false)}>Abbrechen</StyledButton1>
                        <StyledButton3 onClick={deletePicture}>Löschen</StyledButton3>
                    </StyledDiv3>
                </StyledDiv2>
            </StyledDiv>
        )}
        <StyledSection>
            <StyledHeader>
                <h1>{baby.name}</h1>
            </StyledHeader>
            <StyledUl>
                {baby.pictureGallery.map((picture: GalleryPictureModel) =>
                    <StyledLi key={picture.name} onClick={() => {
                        handleOpenPicture(picture)
                    }}>
                        <StyledImg2 src={picture.url} alt={picture.name}/>
                    </StyledLi>
                )}
            </StyledUl>
            <StyledSection2>
                <StyledButton onClick={() => setIsUpload(!isUpload)}>Neues Babybild hinzufügen</StyledButton>
            </StyledSection2>
        </StyledSection>
        <StyledButton2>
            <StyledLink2 to={"/Babyoverview"}>Alle Baby's</StyledLink2>
        </StyledButton2>
    </>;
}


const StyledHeader = styled.header`
  background-color: var(--color-white);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const StyledButton2 = styled.button`
  border: none;
  background-color: transparent;
  width: 100%;
  cursor: pointer;
`

const StyledLink2 = styled(Link)`
  padding: 1rem 5rem;
  background-color: var(--color-background);
  display: flex;
  justify-content: center;
  border-radius: 1rem;
  color: var(--color-white);
  font-family: Ubuntu, sans-serif;
  text-decoration: none;
  margin: 0.5rem;
  border: 1px solid white;
`

const StyledUl = styled.ul`
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const StyledLi = styled.li`
  display: flex;
  justify-content: center;
  background-color: white;
  list-style: none;
`

const StyledImg2 = styled.img`
  width: 20vw;
  object-fit: cover;
  margin: 0.5rem;
  border-radius: 1rem;
`

const StyledImg3 = styled.img`
  width: 80%;
  height: 100%;
  object-fit: cover;
  margin: 1rem 0 0 0;
  border-radius: 1rem;
`

const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  align-items: center;
`

const StyledSection2 = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: white;
`

const StyledButton = styled.button`
  padding: 1rem 5rem;
  background-color: var(--color-background);
  border: none;
  border-radius: 1rem;
  margin: 0.5rem;
  color: var(--color-white);
  font-family: ubuntu, sans-serif;
  cursor: pointer;
`

const StyledButton1 = styled.button`
  padding: 1rem 5rem;
  background-color: transparent;
  border: 1px solid var(--color-background);
  border-radius: 1rem;
  margin: 0.5rem;
  color: var(--color-background);
  font-family: ubuntu, sans-serif;
  cursor: pointer;
`

const StyledButton3 = styled.button`
  padding: 1rem 5rem;
  background-color: transparent;
  border: 1px solid var(--color-deleteRed);
  border-radius: 1rem;
  margin: 0.5rem;
  color: var(--color-deleteRed);
  font-family: ubuntu, sans-serif;
  cursor: pointer;
`

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  justify-content: center;
  margin: 0;
`

const StyledDiv2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-items: center;
  justify-self: center;
  align-self: center;
  padding: 20px;
  width: 100%;
  max-width: 640px;
  background-color: #fff;
`

const StyledDiv3 = styled.div`
  color: #638e93;
  font-size: 1.5em;
  display: flex;
  justify-content: center;
  padding: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`

const StyledP2 = styled.p`
  font-family: KGPrimaryPenmanshipLined, sans-serif;
  font-size: 2.6rem;
  color: var(--color-background);
  text-shadow: 1px 1px 1px black;
  margin-block-start: 0;
  margin-block-end: 0;
  text-align: center;
  padding: 20px;
`
