import moment from "moment";
import Moralis from "moralis";

Moralis.initialize(process.env.NEXT_PUBLIC_APP_ID || '');
Moralis.serverURL = process.env.NEXT_PUBLIC_SERVER_URL || '';
Moralis.start({
    appId: process.env.NEXT_PUBLIC_APP_ID || '',
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || '',
});

interface Chapter {
    contenido_clase:string; 
    curso_identificador: string;
    curso_nombre: string;
    id: string;
    nombre_clase: string;
    nombre_seccion: string;
    numero_clase: string;
    numero_seccion: string;
    tipo_clase: string;
    url_clase: string;
  }
  
  interface Sections{
    title: string;
    chapters: Chapter[];
  }
  
  interface Data {
    courseName: string;
    courseId: string;
    sections: Sections[];
    actualChapter?: Chapter;
  }
  

interface QuizData{
    id: string;
    totalQuestions: number;
    questions: Question[];
}

interface Question{
    id: string;
    question: string;
    answers: string;
    parsedAnswers: Answer[];
    correctAnswer: string;
}

interface Answer{
    id: string;
    answer: string;
}

interface NftWithPagination{
    cursor: string;
    nfts: any;
    page: number;
    total: number;
    pageSize: number;
}


export const checkHolder = async (holder: string) => {
    const { result } = await Moralis.Web3API.account.getNFTsForContract({
        token_address: '0xfEEE476CFaf56c2f359A63500415d5a2c7F2F2B9',
        address: holder,
        chain: 'polygon',
        limit: 1,
    });
    return result && result.length > 0 || false;
}

export const fetchCourse = async (courseId: string, holder: string, chapter?: string): Promise<Data> => {
    if(await checkHolder(holder)) {
        const resourcesObject = await Moralis.Object.extend("clases");
            const query = new Moralis.Query(resourcesObject);   
            query.ascending('createdAt');
            query.equalTo('curso_identificador', courseId);
            const count = await query.count();
            query.limit(count); 
            const data = (await query.find()).map(resource => { 
                const chapter = {            
                    id: resource.id, 
                    ...resource.attributes
                }
                return {
                    ...chapter,
                }
            });
            const dataBySections = data.reduce<{title: string, chapters: Chapter[]}[]>((acc, curr) => {
                // @ts-ignore
                if(!acc[curr.numero_seccion]) {
                    // @ts-ignore
                    acc[curr.numero_seccion] = {
                        // @ts-ignore
                        title: curr.nombre_seccion,
                        // @ts-ignore
                        chapters: [curr]
                    }
                } else {
                    // @ts-ignore
                    acc[curr.numero_seccion].chapters.push(curr);
                }
                return acc;
            }, []).filter(Boolean);
            const setionsWithOrderedChapters = dataBySections.map(section => {
                return {
                    ...section,
                    chapters: section.chapters.sort((a, b) => {
                        return parseInt(a.numero_clase) - parseInt(b.numero_clase);
                    }),
                }
            })
            return {
                courseName: dataBySections[0].chapters[0].curso_nombre,
                courseId: dataBySections[0].chapters[0].curso_identificador,
                sections: setionsWithOrderedChapters,
                // @ts-ignore
                actualChapter: chapter ? data.find((c) => c.numero_clase === chapter) : undefined
            };
    }
    return {} as Data;
}

export const fetchQuiz = async (quizId: string): Promise<QuizData> => {
        const resourcesObject = await Moralis.Object.extend("quizes");
        const query = new Moralis.Query(resourcesObject);   
        query.ascending('createdAt');
        query.equalTo('quiz', quizId);
        const data = (await query.find()).map(resource => { 
            return {            
                id: resource.id, 
                ...resource.attributes
            }
        });
        if(data.length > 0) {
        const questions = data.map(question => {
            // @ts-ignore
            const parsedAnswers = JSON.parse(question.answers);
            return {
                ...question,
                parsedAnswers,
            }
        })
    return {
        // @ts-ignore
        id: data[0].quiz,
        // @ts-ignore
        totalQuestions: data[0].totalQuestions,
        questions: questions,
    } as QuizData;
    }
    return {} as QuizData;
}


export const fetchMaquinaFelicidadTokens = async (holder: string) => {
    const carasAfectadas = ['Desesperación', 'Nervios', 'Tristeza', 'Arrepentimiento', 'Desagrado', 'Susto', 'Ansiedad','Desesperacion']

    const data = await Moralis.Web3API.account.getNFTsForContract({
        token_address: '0xfEEE476CFaf56c2f359A63500415d5a2c7F2F2B9',
        address: holder,
        chain: 'polygon',
        limit: 100,
    });
    if(data.total && data.total > 100){
        for (let i = 100; i < data.total; i += 100) {
            const dataPaginated = await Moralis.Web3API.account.getNFTsForContract({
                token_address: '0xfEEE476CFaf56c2f359A63500415d5a2c7F2F2B9',
                address: holder,
                chain: 'polygon',
                limit: 100,
                cursor: data.cursor,
            });
            data.result = data.result?.concat(dataPaginated.result || []);
            data.cursor = dataPaginated.cursor;
        }
    }
    const nfts = data.result?.map(nft => {
        return {
            id: nft.token_id,
            metadata: JSON.parse(nft.metadata || '{}'),
        }
    }).filter( nft => {
        // @ts-ignore
        const cara = nft.metadata.attributes.find(attr => attr.trait_type === 'Cara');
        return carasAfectadas.includes(cara.value);
    })
    
    return nfts;

}


export const alreadyFilledHappyMachine = async (holder: string) => {
    const resourcesObject = await Moralis.Object.extend("happymachine");
        const query = new Moralis.Query(resourcesObject);   
        query.ascending('createdAt');
        query.equalTo('wallet', holder);

        return await query.count() > 0;
}

export const enviarBookers = async (bookers: string[], holder: string) => {
    const resourcesObject = await Moralis.Object.extend("happymachine");
    const happyMachine = new resourcesObject();
    
    happyMachine.set('wallet', holder);
    happyMachine.set('tokens', bookers.join(','));

    await happyMachine.save();
    return true;
}


export const checkVoucherClaimed = async (account: string) => {
    const resourcesObject = await Moralis.Object.extend("claimed_nexstory");
    const query = new Moralis.Query(resourcesObject);   
    query.ascending('createdAt');
    query.equalTo('account', account);
    // @ts-ignore
    const data : {id: string, createdAt: Date, voucher: string, account: string, expiration_date: Date}[] = (await query.find()).map(resource => { 
        return {            
            id: resource.id, 
            ...resource.attributes
        }
    });
    if(data.length > 0) {
        const lastVoucher = data[data.length - 1];
        const checkIfClaimed60DaysAgo = moment(lastVoucher.createdAt).isBefore(moment().subtract(60, 'days'));
        if(checkIfClaimed60DaysAgo) {
            return {
                voucher: lastVoucher.voucher,
                expirationDate: lastVoucher.expiration_date,
                daysLeft: moment(lastVoucher.expiration_date).diff(moment(), 'days'),
                canClaim: true,
            };
        }
        return {
            canClaim: false,
            voucher: lastVoucher.voucher,
            expirationDate: lastVoucher.expiration_date,
            daysLeft: moment(lastVoucher.expiration_date).diff(moment(), 'days'),
        };
    }
        return {
            voucher: null,
            expirationDate: null,
            daysLeft: 0,
            canClaim: true,
        };

}

export const claimVoucher = async (account: string) => {
    const resourcesObject = await Moralis.Object.extend("nexstory");
    const query = new Moralis.Query(resourcesObject);   
    query.ascending('createdAt');
    query.equalTo('claimed', false);
    const voucher = await query.first( );
    if(voucher) {
        const claimedObject = await Moralis.Object.extend("claimed_nexstory");
        const claimed = new claimedObject();
        claimed.set('account', account);
        claimed.set('voucher', voucher.attributes.voucher_code);
        claimed.set('expiration_date', moment().add(60, 'days').toDate());
        await claimed.save();
        await voucher.set('claimed', true);
        await voucher.save();
        return {
            status: 'success',
            voucher: voucher.attributes.voucher_code,
            expirationDate: moment().add(60, 'days').toDate(),
            daysLeft: 60,
        };
    }
    return {
        status: 'error',
        voucher: null,
        expirationDate: null,
        daysLeft: 0,
    };
}
