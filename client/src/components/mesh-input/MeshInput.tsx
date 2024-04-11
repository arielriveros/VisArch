import { useEffect, useRef, useState } from 'react';
import { Mesh, MeshStandardMaterial, TextureLoader } from 'three';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { adjustMesh, convertToGLB, loadGeometry, pngFromMesh } from '@/utils/utils';
import PreviewMesh from './PreviewMesh';

type SupportedMeshInput = null | 'obj' | 'ply';

interface MeshInputProps {
  handleMesh: (glbFile: File, screenshot: File) => void;
}

export default function MeshInput(props: MeshInputProps) {
  const [meshFile, setMeshFile] = useState<File | null>(null);
  const [textureFile, setTextureFile] = useState<File | null>(null);
  const [textureImage, setTextureImage] = useState<HTMLImageElement | null>(null);
  const [meshData, setMeshData] = useState<{meshPath: string, texturePath: string, format: SupportedMeshInput}>({meshPath: '', texturePath: '', format: null});
  const [loading, setLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const meshRef = useRef<Mesh>(null);
  const handleMeshRef = useRef(props.handleMesh);
  const { t } = useTranslation();

  useEffect(() => {
    handleMeshRef.current = props.handleMesh;
  }, [props.handleMesh]);

  // Handle file upload
  useEffect(() => {
    if (meshFile) {
      const extension = meshFile.name.split('.').pop();
      if (!extension) return;
      setMeshData(prev => ({...prev, meshPath: URL.createObjectURL(meshFile), format: extension as SupportedMeshInput}));
    }
  }, [meshFile]);

  // Handle texture upload
  useEffect(() => {
    if (textureFile) {
      const urlPath = URL.createObjectURL(textureFile);
      setMeshData(prev => ({...prev, texturePath: urlPath}));
      const image = new Image();
      image.src = urlPath;
      setTextureImage(image);
    }
  }, [textureFile]);

  // Load mesh on format or meshPath change
  useEffect(() => {
    if (!meshData.format) return;
    setLoading(true);
    loadGeometry(meshData.meshPath, meshData.format).then(
      geometry => {
        if (meshRef.current) {
          meshRef.current.name = meshData.meshPath.split('/').pop()?.split('.').shift() || 'mesh';
          meshRef.current.geometry = geometry;
        }

        setLoading(false);
      }
    );
  }, [meshData.format, meshData.meshPath]);

  // Load texture on texturePath change
  useEffect(() => {
    if (meshData.texturePath && meshRef.current) {
      setLoading(true);
      const texture = new TextureLoader().load(
        meshData.texturePath,
        () => setLoading(false)
      );
      meshRef.current.material = new MeshStandardMaterial({map: texture});
    }
  }, [meshData.texturePath]);


  const handleMeshData = async () => {
    if (meshRef.current) {
      // Reset preview rotation
      setRotation(0);

      // Normalize mesh and center it
      adjustMesh(meshRef.current);

      // Convert to GLB
      const glbFile = await convertToGLB(meshRef.current);

      // Take a screenshot
      const pngFile = await pngFromMesh(meshRef.current);

      if (glbFile && pngFile)
        handleMeshRef.current(glbFile, pngFile);
    }
  };

  // On loading, export the mesh to glb and get a screenshot
  useEffect(() => {
    if (loading) return;
    handleMeshData();
  }, [loading]);

  useEffect(() => {
    setInterval(() => {
      setRotation(prev => prev + 0.005);
    }, 1000 / 60);
  },[]);

  return (
    <div className='flex flex-row w-full justify-between'>
      <div className='flex flex-col w-1/2'>
        <label>
          {t('components.mesh-input.mesh')}
        </label>
        <div className='flex flex-col w-full h-full'>
          <Canvas camera={{position: [0, 0, 2]}} gl={{ preserveDrawingBuffer: true }} >
            <ambientLight />
            <PreviewMesh meshRef={meshRef} rotation={rotation} />
          </Canvas>
          <label
            htmlFor='mesh_input'
            className='cursor-pointer text-center border border-black bg-gray-700 text-white'
          >
            {t('components.mesh-input.upload-mesh')}
          </label>
          <input
            id='mesh_input'
            className='hidden'
            type='file'
            accept='.obj, .ply'
            onChange={e => setMeshFile(e.target.files?.item(0) || null) }
          />
        </div>
      </div>
      <div className='flex flex-col w-1/2'>
        <label>
          {t('components.mesh-input.texture')}
        </label>
        <div className='flex flex-col w-full'>
          { textureImage ?
            <img src={textureImage?.src} alt='texture' width='100%' height='100%' />
            :
            <div>
              {t('components.mesh-input.no-texture')}
            </div>
          }
          <label
            htmlFor='texture_input'
            className='cursor-pointer text-center border border-black bg-gray-700 text-white'
          >
            {t('components.mesh-input.upload-texture')}
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
