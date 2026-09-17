import { useEffect, useRef, useState } from 'react';
import { Button, Card, Icon, Modal, Tag } from 'animal-island-ui';

const photos = [
  { file: '509ed6b62c8db790b04c140436526267.jpg', caption: '烛光里的小小心愿', alt: '两人捧着点亮蜡烛的生日蛋糕合影', width: 1080, height: 1440 },
  { file: 'b72a8c6230566baea750bf3f587aea14.jpg', caption: '最喜欢的笑容，就在身边', alt: '两人和猫咪在生日烛光中微笑合影', width: 1080, height: 1440 },
  { file: '0bd09747c3cac4187f240d698884a229.jpg', caption: '平凡日子里的温柔陪伴', alt: '猫咪趴在电脑旁的桌面上', width: 1280, height: 1707 },
  { file: '89658bbae8f2c0edeb1c4a5cc1f1f434.jpg', caption: '一家人的快乐，要好好收藏', alt: '两人抱着猫咪，和生日蛋糕一起合影', width: 1080, height: 1440 },
  { file: '0ff7657163ef7e93869d903953485cbf.jpg', caption: '有你，每一天都值得纪念', alt: '温暖烛光中，两人靠在一起留下生日合照', width: 1080, height: 1440 },
  { file: 'a183a56a7e486b5cd6dcc2e8a0536279.jpg', caption: '回家，就有可爱在等你', alt: '两只猫咪在家中的地板上休息', width: 3072, height: 4096 },
  { file: 'e0d982848ae9ac85d03c1bcc4c353083.jpg', caption: '往后的四季，也要一起拍照', alt: '两人和猫咪一起在烛光前做出俏皮表情', width: 1080, height: 1440 },
];

export function preloadPhotos() {
  for (const photo of photos) {
    const image = new Image();
    image.fetchPriority = 'low';
    image.decoding = 'async';
    image.src = `./img/${photo.file}`;
  }
}

export default function PhotoWall({ onBack }: { onBack: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[number] | null>(null);

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);

  return (
    <Card className="photo-wall" aria-labelledby="photo-wall-title">
      <div className="photo-wall-top">
        <Tag color="warm-peach-pink" variant="soft"><Icon name="Camera" size={14} /> {photos.length} 张小小的幸福</Tag>
        <Button className="photo-back" type="text" icon={<Icon name="Heart" size={16} />} onClick={onBack}>返回结尾</Button>
      </div>
      <div className="photo-wall-heading">
        <h2 id="photo-wall-title" ref={headingRef} tabIndex={-1} className="ending-heading">把有你的日子，珍藏起来。</h2>
        <p className="ending-description">从走过的四季，到镜头里的我们。<br />点开照片，再看看那些闪闪发光的小日常。</p>
      </div>
      <div className="photo-wall-scroll" role="region" aria-label="我们的照片墙" tabIndex={0}>
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <figure className="photo-memory" key={photo.file}>
              <Button className="photo-open" type="text" aria-label={`查看照片：${photo.caption}`} onClick={() => setSelectedPhoto(photo)}>
                <img src={`./img/${photo.file}`} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
              </Button>
              <figcaption><span className="photo-number">{String(index + 1).padStart(2, '0')}</span><span>{photo.caption}</span><Icon name="Heart" size={13} /></figcaption>
            </figure>
          ))}
        </div>
        <p className="photo-wall-note"><Icon name="Leaf" size={16} /> 照片会越攒越多，我们的故事也是。</p>
      </div>
      <Modal className="viewport-modal photo-preview" open={selectedPhoto !== null} title={selectedPhoto?.caption} width={600} typewriter={false} onClose={() => setSelectedPhoto(null)} footer={<Button type="primary" onClick={() => setSelectedPhoto(null)}>回到照片墙</Button>}>
        {selectedPhoto ? <img src={`./img/${selectedPhoto.file}`} alt={selectedPhoto.alt} width={selectedPhoto.width} height={selectedPhoto.height} /> : null}
      </Modal>
    </Card>
  );
}
