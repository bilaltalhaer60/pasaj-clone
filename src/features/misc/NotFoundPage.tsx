import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Sayfa bulunamadı"
      subTitle="İstediğiniz rota henüz oluşturulmamış olabilir."
      extra={
        <Link to="/">
          <Button type="primary">Anasayfaya Dön</Button>
        </Link>
      }
    />
  );
}
