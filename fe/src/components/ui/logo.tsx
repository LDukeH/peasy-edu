const IMAGE_WIDTH = "100%"; // độ rộng logo trong khung trắng
const PADDING_LEFT = 10;    // khoảng trắng bên trái (px) - giảm để logo sát trái hơn
const PADDING_RIGHT = 40;   // khoảng trắng bên phải (px)
const PADDING_Y = 10;       // khoảng trắng trên/dưới (px)
const OFFSET_X = 0;         // dịch ảnh thêm: số âm = sang trái, số dương = sang phải

export function Logo({
  className = "",
  imageWidth = IMAGE_WIDTH,
}: {
  className?: string;
  imageWidth?: string;
}) {
  return (
    <div
      className={`flex items-center justify-start rounded-2xl bg-white ${className}`}
      style={{ padding: `${PADDING_Y}px ${PADDING_RIGHT}px ${PADDING_Y}px ${PADDING_LEFT}px` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/bean_logo.png"
        alt="PeasyEdu – Cùng con tiến bộ"
        style={{ width: imageWidth, height: "auto", marginLeft: OFFSET_X }}
      />
    </div>
  );
}