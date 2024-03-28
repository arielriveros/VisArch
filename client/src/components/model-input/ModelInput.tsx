import { useEffect, useRef, useState } from 'react';
import { Mesh, MeshStandardMaterial, TextureLoader } from 'three';
import { Canvas } from '@react-three/fiber';
import { adjustMesh, convertToGLB, loadGeometry, pngFromMesh } from '@/utils/utils';
import PreviewModel from './PreviewModel';

type SupportedModelInput = null | 'obj' | 'ply';

interface ModelInputProps {
  handleModel: (glbFile: File, screenshot: File) => void;
}

export default function ModelInput(props: ModelInputProps) {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [textureFile, setTextureFile] = useState<File | null>(null);
  const [textureImage, setTextureImage] = useState<HTMLImageElement | null>(null);
  const [modelData, setModelData] = useState<{modelPath: string, texturePath: string, format: SupportedModelInput}>({modelPath: '', texturePath: '', format: null});
  const [loading, setLoading] = useState(false);
  const meshRef = useRef<Mesh>(null);
  const handleModelRef = useRef(props.handleModel);

  useEffect(() => {
    handleModelRef.current = props.handleModel;
  }, [props.handleModel]);

  // Handle file upload
  useEffect(() => {
    if (modelFile) {
      const extension = modelFile.name.split('.').pop();
      if (!extension) return;
      setModelData(prev => ({...prev, modelPath: URL.createObjectURL(modelFile), format: extension as SupportedModelInput}));
    }
  }, [modelFile]);

  // Handle texture upload
  useEffect(() => {
    if (textureFile) {
      const urlPath = URL.createObjectURL(textureFile);
      setModelData(prev => ({...prev, texturePath: urlPath}));
      const image = new Image();
      image.src = urlPath;
      setTextureImage(image);
    }
  }, [textureFile]);

  // Load model on format or modelPath change
  useEffect(() => {
    if (!modelData.format) return;
    setLoading(true);
    loadGeometry(modelData.modelPath, modelData.format).then(
      geometry => {
        if (meshRef.current) {
          meshRef.current.name = modelData.modelPath.split('/').pop()?.split('.').shift() || 'model';
          meshRef.current.geometry = geometry;
        }

        setLoading(false);
      }
    );
  }, [modelData.format, modelData.modelPath]);

  // Load texture on texturePath change
  useEffect(() => {
    if (modelData.texturePath && meshRef.current) {
      setLoading(true);
      const texture = new TextureLoader().load(
        modelData.texturePath,
        () => setLoading(false)
      );
      meshRef.current.material = new MeshStandardMaterial({map: texture});
    }
  }, [modelData.texturePath]);


  const handleModelData = async () => {
    if (meshRef.current) {
      // Normalize mesh and center it
      adjustMesh(meshRef.current);

      // Convert to GLB
      const glbFile = await convertToGLB(meshRef.current);

      // Take a screenshot
      const pngFile = await pngFromMesh(meshRef.current);

      if (glbFile && pngFile)
        handleModelRef.current(glbFile, pngFile);
    }
  };

  // On loading, export the mesh to glb and get a screenshot
  useEffect(() => {
    if (loading) return;
    handleModelData();
  }, [loading]);


  return (
    <div className='flex flex-row w-full justify-between'>
      <div className='flex flex-col w-1/2'>
        <label> Model </label>
        <div className='flex flex-col w-full h-full'>
          <Canvas camera={{position: [0, 0, 2]}} gl={{ preserveDrawingBuffer: true }} >
            <ambientLight />
            <PreviewModel meshRef={meshRef} />
          </Canvas>
          <label
            htmlFor='model_input'
            className='cursor-pointer text-center border border-black bg-gray-700 text-white'
          >
            Upload Model
          </label>
          <input
            id='model_input'
            className='hidden'
            type='file'
            accept='.obj, .ply'
            onChange={e => setModelFile(e.target.files?.item(0) || null) }
          />
        </div>
      </div>
      <div className='flex flex-col w-1/2'>
        <label> Texture </label>
        <div className='flex flex-col w-full'>
          { textureImage ?
            <img src={textureImage?.src} alt='texture' width='100%' height='100%' />
            :
            <div> No texture </div>
          }
          <label
            htmlFor='texture_input'
            className='cursor-pointer text-center border border-black bg-gray-700 text-white'
          >
            Upload Texture
          </label>
          <input
            id='texture_input'
            className='hidden'
            type='file'
            accept='.png, .jpg, .jpeg'
            onChange={e => setTextureFile(e.target.files?.item(0) || null) }
          />
        </div>
      </div>
    </div>
  );
}
