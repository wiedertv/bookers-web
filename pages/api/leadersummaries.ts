// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Moralis from 'moralis';
import { checkHolder } from '../../utils/functions';
type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { wallet } = req.query;
  checkHolder(wallet as string).then(async (holder) => {
    if(holder) {
    res.status(200).redirect(`https://www.leadersummaries.com/es/libros?corporation_nv=ce76a3743f174dbaf284134213e74435`);
    }
    else {
      res.status(200).redirect(`https://holders.bookers.club/`);
    }
  }).catch(() => {
    
    res.status(200).redirect(`https://holders.bookers.club/`)
  });
}
