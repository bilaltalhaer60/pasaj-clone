import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="Sayfa bulunamadı"
      subTitle="Tanımlanmayan bir rotaya gittiniz."
      extra={
        <Button type="primary">
          <Link to="/">Anasayfaya Dön</Link>
        </Button>
      }
    />
  );
};

